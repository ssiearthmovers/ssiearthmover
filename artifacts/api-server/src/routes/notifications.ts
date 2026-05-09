import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { requireAuth, type AuthPayload } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.get("/notifications", requireAuth, async (req, res) => {
  const auth = res.locals["auth"] as AuthPayload;
  try {
    const rows = await db
      .select()
      .from(notificationsTable)
      .where(auth.role === "admin" ? isNull(notificationsTable.workerId) : eq(notificationsTable.workerId, auth.workerId!))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(30);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch notifications");
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/notifications/read-all", requireAuth, async (req, res) => {
  const auth = res.locals["auth"] as AuthPayload;
  try {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(auth.role === "admin" ? isNull(notificationsTable.workerId) : eq(notificationsTable.workerId, auth.workerId!));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to mark all read");
    res.status(500).json({ error: "Failed to mark all read" });
  }
});

router.patch("/notifications/:id/read", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to mark notification read");
    res.status(500).json({ error: "Failed to mark read" });
  }
});

export default router;
