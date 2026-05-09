import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { quickReplyTemplatesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.get("/templates", requireAuth, async (req, res) => {
  try {
    const templates = await db.select().from(quickReplyTemplatesTable).orderBy(quickReplyTemplatesTable.createdAt);
    res.json(templates);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch templates");
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

router.post("/templates", requireAdmin, async (req, res) => {
  const { title, body } = req.body as { title?: string; body?: string };
  if (!title?.trim() || !body?.trim()) {
    res.status(400).json({ error: "Title and body are required" });
    return;
  }
  try {
    const created = await db
      .insert(quickReplyTemplatesTable)
      .values({ title: title.trim(), body: body.trim() })
      .returning();
    res.status(201).json(created[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create template");
    res.status(500).json({ error: "Failed to create template" });
  }
});

router.delete("/templates/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.delete(quickReplyTemplatesTable).where(eq(quickReplyTemplatesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete template");
    res.status(500).json({ error: "Failed to delete template" });
  }
});

export default router;
