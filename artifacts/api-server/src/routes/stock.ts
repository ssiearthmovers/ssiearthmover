import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, stockHistoryTable, notificationsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthPayload } from "../middlewares/adminAuth.js";

function computeStatus(qty: number, reorderLevel: number): string {
  if (qty === 0) return "out-of-stock";
  if (qty <= reorderLevel) return "low-stock";
  return "in-stock";
}

const router: IRouter = Router();

router.get("/stock/products", requireAuth, async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.name);
    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/stock/products", requireAdmin, async (req, res) => {
  const { partNumber, brand, model, name, description, unit, rackLocation, photoUrl, quantity, reorderLevel } = req.body as {
    partNumber?: string; brand?: string; model?: string; name?: string;
    description?: string; unit?: string; rackLocation?: string;
    photoUrl?: string; quantity?: number; reorderLevel?: number;
  };
  if (!partNumber?.trim() || !name?.trim()) {
    res.status(400).json({ error: "Part number and name are required" });
    return;
  }
  const qty = quantity ?? 0;
  const rl = reorderLevel ?? 5;
  try {
    const created = await db.insert(productsTable).values({
      partNumber: partNumber.trim().toUpperCase(),
      brand: brand?.trim() || null,
      model: model?.trim() || null,
      name: name.trim(),
      description: description?.trim() || null,
      unit: unit?.trim() || "pcs",
      rackLocation: rackLocation?.trim() || null,
      photoUrl: photoUrl?.trim() || null,
      quantity: qty,
      reorderLevel: rl,
      status: computeStatus(qty, rl),
    }).returning();
    res.status(201).json(created[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      res.status(409).json({ error: "Part number already exists" }); return;
    }
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.patch("/stock/products/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const body = req.body as Record<string, string | number | undefined | null>;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const strFields = ["partNumber", "brand", "model", "name", "description", "unit", "rackLocation", "photoUrl"];
  for (const f of strFields) {
    if (body[f] !== undefined) {
      const val = body[f] ? String(body[f]).trim() : null;
      updates[f] = f === "partNumber" && val ? val.toUpperCase() : val;
    }
  }
  if (body["reorderLevel"] !== undefined) updates["reorderLevel"] = Number(body["reorderLevel"]);
  try {
    const current = await db.select({ quantity: productsTable.quantity, reorderLevel: productsTable.reorderLevel }).from(productsTable).where(eq(productsTable.id, id));
    if (!current[0]) { res.status(404).json({ error: "Product not found" }); return; }
    const rl = updates["reorderLevel"] !== undefined ? Number(updates["reorderLevel"]) : current[0].reorderLevel;
    updates["status"] = computeStatus(current[0].quantity, rl);
    const updated = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    res.json(updated[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      res.status(409).json({ error: "Part number already exists" }); return;
    }
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/stock/products/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Failed to delete product" });
  }
});

router.patch("/stock/products/:id/stock", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const auth = res.locals["auth"] as AuthPayload;
  const { action, amount, reason, relatedEnquiryId, manualStatus } = req.body as {
    action?: "add" | "remove" | "set"; amount?: number; reason?: string;
    relatedEnquiryId?: number | null; manualStatus?: string;
  };
  if (!action || amount === undefined || amount < 0) {
    res.status(400).json({ error: "Action and non-negative amount required" });
    return;
  }
  try {
    const rows = await db.select().from(productsTable).where(eq(productsTable.id, id));
    const product = rows[0];
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    const prevQty = product.quantity;
    let newQty: number;
    if (action === "add") newQty = prevQty + amount;
    else if (action === "remove") newQty = Math.max(0, prevQty - amount);
    else newQty = amount;
    const MANUAL = ["reserved", "dispatched"];
    const newStatus = manualStatus && MANUAL.includes(manualStatus) ? manualStatus : computeStatus(newQty, product.reorderLevel);
    const actorName = auth.role === "admin" ? "Admin" : (auth.workerName ?? "Team Member");
    await db.insert(stockHistoryTable).values({
      productId: id, previousQty: prevQty, newQty, change: newQty - prevQty,
      reason: reason?.trim() || null,
      relatedEnquiryId: relatedEnquiryId ?? null,
      actorName, actorRole: auth.role,
    });
    const updated = await db.update(productsTable)
      .set({ quantity: newQty, status: newStatus, updatedAt: new Date() })
      .where(eq(productsTable.id, id)).returning();
    if ((newStatus === "low-stock" || newStatus === "out-of-stock") && prevQty > product.reorderLevel) {
      await db.insert(notificationsTable).values({
        workerId: null, enquiryId: null, type: "low_stock",
        message: `Stock alert: ${product.name} (${product.partNumber}) is ${newStatus === "out-of-stock" ? "OUT OF STOCK" : "LOW STOCK"} — ${newQty} ${product.unit} remaining`,
      });
    }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update stock");
    res.status(500).json({ error: "Failed to update stock" });
  }
});

router.get("/stock/products/:id/history", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const history = await db.select().from(stockHistoryTable)
      .where(eq(stockHistoryTable.productId, id))
      .orderBy(desc(stockHistoryTable.createdAt)).limit(50);
    res.json(history);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch history");
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
