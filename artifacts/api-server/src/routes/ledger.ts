import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  customersTable, invoicesTable, invoiceItemsTable, paymentsTable,
  productsTable, stockHistoryTable, notificationsTable, warehouseStockTable,
} from "@workspace/db/schema";
import { eq, desc, sql, ilike, or, and, lt, sum } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

/* ── Invoice number generator ─────────────────────────────────────────── */
async function nextInvoiceNumber(): Promise<string> {
  const [row] = await db
    .select({ max: sql<string>`max(invoice_number)` })
    .from(invoicesTable);
  const max = row?.max ?? null;
  if (!max) return "INV-0001";
  const num = parseInt(max.replace(/^INV-/, ""), 10);
  return `INV-${String((isNaN(num) ? 0 : num) + 1).padStart(4, "0")}`;
}

/* ── Status deriver ───────────────────────────────────────────────────── */
function deriveStatus(totalAmount: number, paidAmount: number, dueDate: Date | null): string {
  if (paidAmount >= totalAmount) return "paid";
  if (paidAmount > 0) {
    if (dueDate && new Date() > dueDate) return "overdue";
    return "partial";
  }
  if (dueDate && new Date() > dueDate) return "overdue";
  return "unpaid";
}

/* ═══════════════════════════════════════════════════════════════════════
   CUSTOMERS
═══════════════════════════════════════════════════════════════════════ */

router.get("/ledger/customers", requireAuth, async (req, res) => {
  try {
    const q = String(req.query["q"] ?? "").trim();
    let rows = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
    if (q) {
      const ql = q.toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(ql) ||
        (r.company ?? "").toLowerCase().includes(ql) ||
        r.phone.includes(q) ||
        (r.gstin ?? "").toLowerCase().includes(ql)
      );
    }
    // Attach outstanding balance
    const balances = await db
      .select({
        customerId: invoicesTable.customerId,
        outstanding: sql<number>`coalesce(sum(total_amount - paid_amount), 0)::int`,
      })
      .from(invoicesTable)
      .where(sql`status != 'paid'`)
      .groupBy(invoicesTable.customerId);
    const balMap: Record<number, number> = {};
    for (const b of balances) balMap[b.customerId] = b.outstanding;
    res.json(rows.map(r => ({ ...r, outstanding: balMap[r.id] ?? 0 })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch customers");
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.post("/ledger/customers", requireAdmin, async (req, res) => {
  const { name, company, phone, email, gstin, address, city, state, creditLimit, notes } =
    req.body as Record<string, string | number | undefined>;
  if (!String(name ?? "").trim() || !String(phone ?? "").trim()) {
    res.status(400).json({ error: "Name and phone are required" });
    return;
  }
  try {
    const [created] = await db.insert(customersTable).values({
      name: String(name).trim(),
      company: String(company ?? "").trim() || null,
      phone: String(phone).trim(),
      email: String(email ?? "").trim() || null,
      gstin: String(gstin ?? "").trim() || null,
      address: String(address ?? "").trim() || null,
      city: String(city ?? "").trim() || null,
      state: String(state ?? "").trim() || null,
      creditLimit: Number(creditLimit ?? 0),
      notes: String(notes ?? "").trim() || null,
    }).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create customer");
    res.status(500).json({ error: "Failed to create customer" });
  }
});

router.get("/ledger/customers/:id", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }
    const invoices = await db.select().from(invoicesTable)
      .where(eq(invoicesTable.customerId, id))
      .orderBy(desc(invoicesTable.createdAt));
    const payments = await db.select().from(paymentsTable)
      .where(eq(paymentsTable.customerId, id))
      .orderBy(desc(paymentsTable.paymentDate));
    const totalBilled = invoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);
    res.json({ customer, invoices, payments, totalBilled, totalPaid, outstanding: totalBilled - totalPaid });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch customer ledger");
    res.status(500).json({ error: "Failed to fetch customer ledger" });
  }
});

router.patch("/ledger/customers/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const body = req.body as Record<string, string | number | undefined | null>;
  const fields = ["name", "company", "phone", "email", "gstin", "address", "city", "state", "notes"];
  const updates: Record<string, unknown> = {};
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f] ? String(body[f]).trim() || null : null;
  }
  if (body["creditLimit"] !== undefined) updates["creditLimit"] = Number(body["creditLimit"]);
  try {
    const [updated] = await db.update(customersTable).set(updates).where(eq(customersTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update customer");
    res.status(500).json({ error: "Failed to update customer" });
  }
});

/* ═══════════════════════════════════════════════════════════════════════
   INVOICES
═══════════════════════════════════════════════════════════════════════ */

router.get("/ledger/invoices", requireAuth, async (req, res) => {
  try {
    const status = String(req.query["status"] ?? "").trim();
    const customerId = req.query["customerId"] ? parseInt(String(req.query["customerId"]), 10) : null;
    let rows = await db.select().from(invoicesTable).orderBy(desc(invoicesTable.createdAt));
    if (status) rows = rows.filter(r => r.status === status);
    if (customerId && !isNaN(customerId)) rows = rows.filter(r => r.customerId === customerId);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch invoices");
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

router.post("/ledger/invoices", requireAdmin, async (req, res) => {
  const {
    customerId, dueDate, taxPercent, notes, deductStock,
    items,
  } = req.body as {
    customerId?: number;
    dueDate?: string;
    taxPercent?: number;
    notes?: string;
    deductStock?: boolean;
    items?: Array<{
      productId?: number | null;
      partNumber?: string;
      partName: string;
      quantity: number;
      unitPrice: number;
    }>;
  };

  if (!customerId || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "customerId and items[] are required" });
    return;
  }

  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
    if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

    // Pre-validate stock availability before touching the DB
    if (deductStock !== false) {
      const stockErrors: string[] = [];
      for (const it of items) {
        if (it.productId) {
          const [product] = await db.select({ name: productsTable.name, partNumber: productsTable.partNumber, quantity: productsTable.quantity, unit: productsTable.unit })
            .from(productsTable).where(eq(productsTable.id, it.productId));
          if (product && product.quantity < it.quantity) {
            stockErrors.push(`${product.name} (${product.partNumber}): requested ${it.quantity} ${product.unit}, only ${product.quantity} in stock`);
          }
        }
      }
      if (stockErrors.length > 0) {
        res.status(409).json({ error: "Insufficient stock", details: stockErrors });
        return;
      }
    }

    const invoiceNumber = await nextInvoiceNumber();
    const tax = Number(taxPercent ?? 18);
    const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const taxAmount = Math.round(subtotal * tax / 100);
    const totalAmount = subtotal + taxAmount;
    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    const [invoice] = await db.insert(invoicesTable).values({
      invoiceNumber,
      customerId,
      customerName: customer.name,
      customerCompany: customer.company ?? null,
      customerPhone: customer.phone,
      customerGstin: customer.gstin ?? null,
      customerAddress: [customer.address, customer.city, customer.state].filter(Boolean).join(", ") || null,
      dueDate: parsedDueDate,
      status: deriveStatus(totalAmount, 0, parsedDueDate),
      subtotal,
      taxPercent: tax,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      deductStock: deductStock !== false,
      notes: notes?.trim() || null,
    }).returning();

    // Insert items
    const itemValues = items.map(it => ({
      invoiceId: invoice!.id,
      productId: it.productId ?? null,
      partNumber: it.partNumber?.trim() || null,
      partName: it.partName.trim(),
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      amount: it.quantity * it.unitPrice,
    }));
    await db.insert(invoiceItemsTable).values(itemValues);

    // Deduct stock if requested
    if (deductStock !== false) {
      for (const it of items) {
        if (it.productId) {
          const [product] = await db.select().from(productsTable).where(eq(productsTable.id, it.productId));
          if (product) {
            const newQty = Math.max(0, product.quantity - it.quantity);
            const newStatus =
              newQty === 0 ? "out-of-stock" :
              newQty <= product.reorderLevel ? "low-stock" : "in-stock";
            await db.update(productsTable)
              .set({ quantity: newQty, status: newStatus, updatedAt: new Date() })
              .where(eq(productsTable.id, it.productId));
            await db.insert(stockHistoryTable).values({
              productId: it.productId,
              previousQty: product.quantity,
              newQty,
              change: -(it.quantity),
              reason: `Sale — Invoice ${invoiceNumber}`,
              relatedEnquiryId: null,
              actorName: "Admin",
              actorRole: "admin",
            });
            if (newStatus !== "in-stock" && product.quantity > product.reorderLevel) {
              await db.insert(notificationsTable).values({
                workerId: null, enquiryId: null, type: "low_stock",
                message: `Stock alert: ${product.name} (${product.partNumber}) is ${newStatus === "out-of-stock" ? "OUT OF STOCK" : "LOW STOCK"} — ${newQty} ${product.unit} remaining (after sale ${invoiceNumber})`,
              });
            }
          }
        }
      }
    }

    const savedItems = await db.select().from(invoiceItemsTable).where(eq(invoiceItemsTable.invoiceId, invoice!.id));
    res.status(201).json({ ...invoice, items: savedItems });
  } catch (err) {
    req.log.error({ err }, "Failed to create invoice");
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

router.get("/ledger/invoices/:id", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }
    const items = await db.select().from(invoiceItemsTable).where(eq(invoiceItemsTable.invoiceId, id));
    const payments = await db.select().from(paymentsTable)
      .where(eq(paymentsTable.invoiceId, id)).orderBy(desc(paymentsTable.paymentDate));
    res.json({ ...invoice, items, payments });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch invoice");
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

/* ═══════════════════════════════════════════════════════════════════════
   PAYMENTS
═══════════════════════════════════════════════════════════════════════ */

router.post("/ledger/invoices/:id/payments", requireAdmin, async (req, res) => {
  const invoiceId = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(invoiceId)) { res.status(400).json({ error: "Invalid invoice ID" }); return; }

  const { amount, paymentMethod, referenceNumber, notes, paymentDate } = req.body as {
    amount?: number;
    paymentMethod?: string;
    referenceNumber?: string;
    notes?: string;
    paymentDate?: string;
  };

  if (!amount || amount <= 0) {
    res.status(400).json({ error: "Amount must be positive" });
    return;
  }

  try {
    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, invoiceId));
    if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }

    const remaining = invoice.totalAmount - invoice.paidAmount;
    const actualAmount = Math.min(amount, remaining);

    const [payment] = await db.insert(paymentsTable).values({
      invoiceId,
      customerId: invoice.customerId,
      amount: actualAmount,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      paymentMethod: paymentMethod?.trim() || "cash",
      referenceNumber: referenceNumber?.trim() || null,
      notes: notes?.trim() || null,
    }).returning();

    const newPaid = invoice.paidAmount + actualAmount;
    const newStatus = deriveStatus(invoice.totalAmount, newPaid, invoice.dueDate);

    const [updatedInvoice] = await db.update(invoicesTable)
      .set({ paidAmount: newPaid, status: newStatus })
      .where(eq(invoicesTable.id, invoiceId))
      .returning();

    res.status(201).json({ payment, invoice: updatedInvoice });
  } catch (err) {
    req.log.error({ err }, "Failed to record payment");
    res.status(500).json({ error: "Failed to record payment" });
  }
});

/* ═══════════════════════════════════════════════════════════════════════
   DUES SUMMARY DASHBOARD
═══════════════════════════════════════════════════════════════════════ */

router.get("/ledger/summary", requireAuth, async (req, res) => {
  try {
    const now = new Date();

    const allInvoices = await db.select().from(invoicesTable);

    const totalBilled = allInvoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalCollected = allInvoices.reduce((s, i) => s + i.paidAmount, 0);
    const totalOutstanding = totalBilled - totalCollected;

    const overdueInvoices = allInvoices.filter(i =>
      i.status !== "paid" && i.dueDate && new Date(i.dueDate) < now
    );
    const totalOverdue = overdueInvoices.reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);

    const unpaidCount = allInvoices.filter(i => i.status === "unpaid").length;
    const partialCount = allInvoices.filter(i => i.status === "partial").length;
    const paidCount = allInvoices.filter(i => i.status === "paid").length;
    const overdueCount = overdueInvoices.length;

    // Top outstanding customers
    const customerBalances: Record<number, { name: string; company: string | null; outstanding: number }> = {};
    for (const inv of allInvoices) {
      if (inv.status !== "paid") {
        if (!customerBalances[inv.customerId]) {
          customerBalances[inv.customerId] = { name: inv.customerName, company: inv.customerCompany, outstanding: 0 };
        }
        customerBalances[inv.customerId]!.outstanding += inv.totalAmount - inv.paidAmount;
      }
    }
    const topDebtors = Object.entries(customerBalances)
      .map(([id, d]) => ({ customerId: Number(id), ...d }))
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5);

    // Recent overdue
    const recentOverdue = overdueInvoices
      .sort((a, b) => new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime())
      .slice(0, 10)
      .map(i => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customerName: i.customerName,
        totalAmount: i.totalAmount,
        paidAmount: i.paidAmount,
        outstanding: i.totalAmount - i.paidAmount,
        dueDate: i.dueDate,
        daysOverdue: Math.floor((now.getTime() - new Date(i.dueDate!).getTime()) / 86400000),
      }));

    res.json({
      totalBilled, totalCollected, totalOutstanding, totalOverdue,
      counts: { unpaid: unpaidCount, partial: partialCount, paid: paidCount, overdue: overdueCount, total: allInvoices.length },
      topDebtors, recentOverdue,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch ledger summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
