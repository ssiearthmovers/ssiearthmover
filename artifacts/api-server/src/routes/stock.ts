import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  productsTable, stockHistoryTable, notificationsTable, importHistoryTable, warehouseStockTable
} from "@workspace/db/schema";
import { eq, desc, ilike, or, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthPayload } from "../middlewares/adminAuth.js";

function computeStatus(qty: number, reorderLevel: number): string {
  if (qty === 0) return "out-of-stock";
  if (qty <= reorderLevel) return "low-stock";
  return "in-stock";
}

const CATEGORY_SLUG_MAP: { keywords: string[]; slug: string; label: string }[] = [
  { keywords: ["cutting edge"],              slug: "cutting-edges",      label: "Cutting Edges" },
  { keywords: ["end bit"],                   slug: "end-bits",           label: "End Bits" },
  { keywords: ["grader blade"],              slug: "grader-blades",      label: "Grader Blades" },
  { keywords: ["scarifier", "ripper"],       slug: "scarifier-teeth",    label: "Scarifier Teeth & Ripper Tips" },
  { keywords: ["circle", "draw bar"],        slug: "circle-draw-bar",    label: "Circle & Draw Bar" },
  { keywords: ["sprocket", "worm gear", "ring gear"], slug: "sprockets-gears", label: "Sprockets / Worm Gears / Ring Gears" },
  { keywords: ["hydraulic cylinder"],        slug: "hydraulic-cylinders",label: "Hydraulic Cylinders" },
  { keywords: ["hydraulic"],                 slug: "hydraulic-parts",    label: "Hydraulic Parts" },
  { keywords: ["brake", "braking"],          slug: "braking-system",     label: "Braking System" },
  { keywords: ["ball joint", "tie rod"],     slug: "ball-joints",        label: "Ball Joints & Tie Rod Ends" },
  { keywords: ["drive", "transmission"],     slug: "drive-transmission", label: "Drive & Transmission" },
  { keywords: ["wear plate", "wear"],        slug: "wear-plates",        label: "Wear Plates" },
  { keywords: ["filter"],                    slug: "filters",            label: "Filters" },
  { keywords: ["engine"],                    slug: "engine-parts",       label: "Engine Parts" },
  { keywords: ["electric"],                  slug: "electrical-parts",   label: "Electrical Parts" },
];

function deriveCategorySlug(category: string): { slug: string; label: string } | null {
  const lower = category.toLowerCase();
  // exact slug match first
  const exactSlug = CATEGORY_SLUG_MAP.find((m) => m.slug === lower);
  if (exactSlug) return { slug: exactSlug.slug, label: exactSlug.label };
  // keyword match
  for (const entry of CATEGORY_SLUG_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { slug: entry.slug, label: entry.label };
    }
  }
  return null;
}

const router: IRouter = Router();

/* ── Public availability endpoint ─────────────────────────────────────────── */
router.get("/stock/availability", async (req, res) => {
  try {
    const products = await db
      .select({ partNumber: productsTable.partNumber, status: productsTable.status })
      .from(productsTable);

    const map: Record<string, "available" | "limited" | "unavailable"> = {};
    for (const p of products) {
      if (p.status === "in-stock") map[p.partNumber] = "available";
      else if (p.status === "low-stock") map[p.partNumber] = "limited";
      else map[p.partNumber] = "unavailable";
    }
    res.setHeader("Cache-Control", "public, max-age=120");
    res.json(map);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch availability");
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

/* ── Public product search ─────────────────────────────────────────────────
   GET /api/products/search?q=&brand=&category=&model=&limit=
   Returns safe product info — no quantities or rack locations.              */
router.get("/products/search", async (req, res) => {
  try {
    const q = String(req.query["q"] ?? "").trim();
    const brand = String(req.query["brand"] ?? "").trim();
    const category = String(req.query["category"] ?? "").trim();
    const model = String(req.query["model"] ?? "").trim();
    const limit = Math.min(200, Math.max(1, parseInt(String(req.query["limit"] ?? "100"), 10) || 100));

    const strict = String(req.query["strict"] ?? "") === "1";
    const conditions: ReturnType<typeof ilike>[] = [];
    if (q) {
      conditions.push(
        ilike(productsTable.name, `%${q}%`),
        ilike(productsTable.partNumber, `%${q}%`),
        ilike(productsTable.oemNumber, `%${q}%`),
      );
      if (!strict) {
        conditions.push(
          ilike(productsTable.description, `%${q}%`),
        );
      }
    }

    let rows = await db
      .select({
        id: productsTable.id,
        partNumber: productsTable.partNumber,
        name: productsTable.name,
        brand: productsTable.brand,
        model: productsTable.model,
        category: productsTable.category,
        categorySlug: productsTable.categorySlug,
        oemNumber: productsTable.oemNumber,
        description: productsTable.description,
        unit: productsTable.unit,
        status: productsTable.status,
        quantity: strict ? productsTable.quantity : sql<number>`NULL`,
      })
      .from(productsTable)
      .where(q ? or(...conditions) : undefined)
      .orderBy(productsTable.name)
      .limit(limit * 3);

    if (brand) {
      const bl = brand.toLowerCase();
      rows = rows.filter((r) => r.brand?.toLowerCase().includes(bl));
    }
    if (category) {
      const cl = category.toLowerCase();
      rows = rows.filter((r) =>
        r.category?.toLowerCase().includes(cl) || r.categorySlug?.toLowerCase().includes(cl)
      );
    }
    if (model) {
      const ml = model.toLowerCase();
      rows = rows.filter((r) => r.model?.toLowerCase().includes(ml));
    }

    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(rows.slice(0, limit));
  } catch (err) {
    req.log.error({ err }, "Failed to search products");
    res.status(500).json({ error: "Failed to search products" });
  }
});

/* ── Admin stats ───────────────────────────────────────────────────────────── */
router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [totals] = await db
      .select({
        total: sql<number>`count(*)::int`,
        inStock: sql<number>`count(*) filter (where status = 'in-stock')::int`,
        lowStock: sql<number>`count(*) filter (where status = 'low-stock')::int`,
        outOfStock: sql<number>`count(*) filter (where status = 'out-of-stock')::int`,
      })
      .from(productsTable);

    const recentImports = await db
      .select()
      .from(importHistoryTable)
      .orderBy(desc(importHistoryTable.createdAt))
      .limit(3);

    res.json({ ...totals, recentImports });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch admin stats");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* ── Admin product list ─────────────────────────────────────────────────── */
router.get("/stock/products", requireAuth, async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.name);
    const warehouseRows = await db.select().from(warehouseStockTable);
    // build breakdown map keyed by productId
    const breakdown: Record<number, Record<string, number>> = {};
    for (const r of warehouseRows) {
      if (!breakdown[r.productId]) breakdown[r.productId] = {};
      breakdown[r.productId]![r.warehouse] = r.quantity;
    }
    const result = products.map((p) => ({ ...p, warehouseBreakdown: breakdown[p.id] ?? {} }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/stock/products", requireAdmin, async (req, res) => {
  const {
    partNumber, brand, model, category, categorySlug, oemNumber,
    name, description, unit, rackLocation, warehouse, photoUrl, quantity, reorderLevel,
  } = req.body as Record<string, string | number | undefined>;

  if (!String(partNumber ?? "").trim() || !String(name ?? "").trim()) {
    res.status(400).json({ error: "Part number and name are required" });
    return;
  }
  const qty = Number(quantity ?? 0);
  const rl = Number(reorderLevel ?? 5);
  try {
    const created = await db.insert(productsTable).values({
      partNumber: String(partNumber).trim().toUpperCase(),
      brand: String(brand ?? "").trim() || null,
      model: String(model ?? "").trim() || null,
      category: String(category ?? "").trim() || null,
      categorySlug: String(categorySlug ?? "").trim() || null,
      oemNumber: String(oemNumber ?? "").trim() || null,
      name: String(name).trim(),
      description: String(description ?? "").trim() || null,
      unit: String(unit ?? "").trim() || "pcs",
      rackLocation: String(rackLocation ?? "").trim() || null,
      warehouse: String(warehouse ?? "").trim() || null,
      photoUrl: String(photoUrl ?? "").trim() || null,
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
  const strFields = [
    "partNumber", "brand", "model", "category", "categorySlug", "oemNumber",
    "name", "description", "unit", "rackLocation", "warehouse", "photoUrl",
  ];
  for (const f of strFields) {
    if (body[f] !== undefined) {
      const val = body[f] ? String(body[f]).trim() : null;
      updates[f] = f === "partNumber" && val ? val.toUpperCase() : val;
    }
  }
  if (body["reorderLevel"] !== undefined) updates["reorderLevel"] = Number(body["reorderLevel"]);
  try {
    const current = await db
      .select({ quantity: productsTable.quantity, reorderLevel: productsTable.reorderLevel })
      .from(productsTable).where(eq(productsTable.id, id));
    if (!current[0]) { res.status(404).json({ error: "Product not found" }); return; }
    const rl = updates["reorderLevel"] !== undefined
      ? Number(updates["reorderLevel"]) : current[0].reorderLevel;
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
  const { action, amount, reason, relatedEnquiryId, manualStatus, warehouse } = req.body as {
    action?: "add" | "remove" | "set"; amount?: number; reason?: string;
    relatedEnquiryId?: number | null; manualStatus?: string; warehouse?: string;
  };
  if (!action || amount === undefined || amount < 0) {
    res.status(400).json({ error: "Action and non-negative amount required" });
    return;
  }
  const VALID_WAREHOUSES = ["rai", "rohini", "mori-gate"];
  const wh = warehouse && VALID_WAREHOUSES.includes(warehouse) ? warehouse : null;
  try {
    const rows = await db.select().from(productsTable).where(eq(productsTable.id, id));
    const product = rows[0];
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    const actorName = auth.role === "admin" ? "Admin" : (auth.workerName ?? "Team Member");

    let newTotalQty: number;

    if (wh) {
      // ── Per-warehouse stock update ─────────────────────────────────────────
      const whRows = await db.select().from(warehouseStockTable)
        .where(eq(warehouseStockTable.productId, id));
      const existing = whRows.find((r) => r.warehouse === wh);
      const prevWhQty = existing?.quantity ?? 0;
      let newWhQty: number;
      if (action === "add") newWhQty = prevWhQty + amount;
      else if (action === "remove") newWhQty = Math.max(0, prevWhQty - amount);
      else newWhQty = amount;

      if (existing) {
        await db.update(warehouseStockTable)
          .set({ quantity: newWhQty, updatedAt: new Date() })
          .where(eq(warehouseStockTable.id, existing.id));
      } else {
        await db.insert(warehouseStockTable).values({ productId: id, warehouse: wh, quantity: newWhQty });
      }
      // recompute total from all warehouses
      const allWh = await db.select().from(warehouseStockTable).where(eq(warehouseStockTable.productId, id));
      newTotalQty = allWh.reduce((s, r) => s + r.quantity, 0);
    } else {
      // ── Whole-product stock update (legacy, no warehouse) ──────────────────
      const prevQty = product.quantity;
      if (action === "add") newTotalQty = prevQty + amount;
      else if (action === "remove") newTotalQty = Math.max(0, prevQty - amount);
      else newTotalQty = amount;
    }

    const MANUAL = ["reserved", "dispatched"];
    const prevQty = product.quantity;
    const newStatus = manualStatus && MANUAL.includes(manualStatus)
      ? manualStatus : computeStatus(newTotalQty, product.reorderLevel);

    await db.insert(stockHistoryTable).values({
      productId: id, previousQty: prevQty, newQty: newTotalQty, change: newTotalQty - prevQty,
      reason: (wh ? `[${wh.toUpperCase()}] ` : "") + (reason?.trim() || ""),
      relatedEnquiryId: relatedEnquiryId ?? null,
      actorName, actorRole: auth.role,
    });
    const updated = await db.update(productsTable)
      .set({ quantity: newTotalQty, status: newStatus, updatedAt: new Date() })
      .where(eq(productsTable.id, id)).returning();

    if ((newStatus === "low-stock" || newStatus === "out-of-stock") && prevQty > product.reorderLevel) {
      await db.insert(notificationsTable).values({
        workerId: null, enquiryId: null, type: "low_stock",
        message: `Stock alert: ${product.name} (${product.partNumber}) is ${newStatus === "out-of-stock" ? "OUT OF STOCK" : "LOW STOCK"} — ${newTotalQty} ${product.unit} remaining`,
      });
    }
    // return product with warehouse breakdown
    const whRows = await db.select().from(warehouseStockTable).where(eq(warehouseStockTable.productId, id));
    const wbMap: Record<string, number> = {};
    for (const r of whRows) wbMap[r.warehouse] = r.quantity;
    res.json({ ...updated[0], warehouseBreakdown: wbMap });
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

/* ── Bulk import ───────────────────────────────────────────────────────────
   POST /api/stock/import
   Body: { rows: ImportRow[], fileName?: string }
   Each row: { partNumber, name, brand?, model?, category?, categorySlug?,
               oemNumber?, description?, unit?, rackLocation?, quantity?,
               reorderLevel? }
   Upserts by partNumber. Returns { inserted, updated, skipped, errors[] }  */
router.post("/stock/import", requireAdmin, async (req, res) => {
  const auth = res.locals["auth"] as AuthPayload;
  const actorName = auth.role === "admin" ? "Admin" : (auth.workerName ?? "Team Member");

  type ImportRow = Record<string, string | number | undefined | null>;
  const { rows, fileName } = req.body as { rows?: ImportRow[]; fileName?: string };
  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({ error: "rows array is required and must not be empty" });
    return;
  }

  let inserted = 0, updated = 0, skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const pn = String(row["partNumber"] ?? row["part_number"] ?? row["PartNumber"] ?? "").trim().toUpperCase();
    const nm = String(row["name"] ?? row["Name"] ?? row["partName"] ?? row["PartName"] ?? "").trim();
    if (!pn || !nm) { skipped++; continue; }

    const qty = Number(row["quantity"] ?? row["Quantity"] ?? row["qty"] ?? 0);
    const rl = Number(row["reorderLevel"] ?? row["reorder_level"] ?? row["ReorderLevel"] ?? row["reorder"] ?? 5);
    const rawCategory = String(row["category"] ?? row["Category"] ?? "").trim();
    const rawSlug = String(row["categorySlug"] ?? row["category_slug"] ?? row["CategorySlug"] ?? "").trim();
    // Auto-derive slug from category name when not explicitly provided
    const derived = !rawSlug && rawCategory ? deriveCategorySlug(rawCategory) : null;
    const finalSlug = rawSlug || derived?.slug || null;
    const finalCategory = rawCategory || derived?.label || null;

    const values = {
      partNumber: pn,
      name: nm,
      brand: String(row["brand"] ?? row["Brand"] ?? "").trim() || null,
      model: String(row["model"] ?? row["Model"] ?? "").trim() || null,
      category: finalCategory,
      categorySlug: finalSlug,
      oemNumber: String(row["oemNumber"] ?? row["oem_number"] ?? row["OemNumber"] ?? row["OEM"] ?? row["oem"] ?? "").trim() || null,
      description: String(row["description"] ?? row["Description"] ?? "").trim() || null,
      unit: String(row["unit"] ?? row["Unit"] ?? "").trim() || "pcs",
      rackLocation: String(row["rackLocation"] ?? row["rack_location"] ?? row["RackLocation"] ?? row["rack"] ?? "").trim() || null,
      warehouse: String(row["warehouse"] ?? row["Warehouse"] ?? row["location"] ?? row["Location"] ?? "").trim() || null,
      quantity: isNaN(qty) ? 0 : qty,
      reorderLevel: isNaN(rl) ? 5 : rl,
      status: computeStatus(isNaN(qty) ? 0 : qty, isNaN(rl) ? 5 : rl),
      updatedAt: new Date(),
    };

    const VALID_WAREHOUSES = ["rai", "rohini", "mori-gate"];
    const whValue = values.warehouse?.toLowerCase().trim() ?? null;
    const validWarehouse = whValue && VALID_WAREHOUSES.includes(whValue) ? whValue : null;

    try {
      const existing = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.partNumber, pn));

      let productId: number;
      if (existing[0]) {
        await db.update(productsTable).set(values).where(eq(productsTable.id, existing[0].id));
        productId = existing[0].id;
        updated++;
      } else {
        const [created] = await db.insert(productsTable).values(values).returning({ id: productsTable.id });
        productId = created!.id;
        inserted++;
      }

      // If a valid warehouse was specified, upsert into warehouse_stock too
      if (validWarehouse && qty > 0) {
        const whExact = await db.select({ id: warehouseStockTable.id })
          .from(warehouseStockTable)
          .where(sql`product_id = ${productId} AND warehouse = ${validWarehouse}`);
        if (whExact[0]) {
          await db.update(warehouseStockTable)
            .set({ quantity: qty, updatedAt: new Date() })
            .where(eq(warehouseStockTable.id, whExact[0].id));
        } else {
          await db.insert(warehouseStockTable).values({ productId, warehouse: validWarehouse, quantity: qty });
        }
        // recompute total from all warehouses so the product total stays accurate
        const allWh = await db.select({ quantity: warehouseStockTable.quantity })
          .from(warehouseStockTable)
          .where(eq(warehouseStockTable.productId, productId));
        const totalQty = allWh.reduce((s, r) => s + r.quantity, 0);
        if (totalQty !== qty) {
          await db.update(productsTable)
            .set({ quantity: totalQty, status: computeStatus(totalQty, values.reorderLevel), updatedAt: new Date() })
            .where(eq(productsTable.id, productId));
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${pn}: ${msg.slice(0, 80)}`);
    }
  }

  try {
    await db.insert(importHistoryTable).values({
      fileName: fileName?.trim() || "paste-import",
      totalRows: rows.length,
      inserted,
      updated,
      skipped,
      errors: errors.length > 0 ? errors.slice(0, 20).join("; ") : null,
      actorName,
    });
  } catch { /* non-fatal */ }

  res.json({ inserted, updated, skipped, errors: errors.slice(0, 10), total: rows.length });
});

/* ── Import history ────────────────────────────────────────────────────── */
router.get("/stock/import-history", requireAdmin, async (req, res) => {
  try {
    const history = await db
      .select()
      .from(importHistoryTable)
      .orderBy(desc(importHistoryTable.createdAt))
      .limit(20);
    res.json(history);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch import history");
    res.status(500).json({ error: "Failed to fetch import history" });
  }
});

export default router;
