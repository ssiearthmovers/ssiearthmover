import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { enquiryRepliesTable, enquiriesTable, notificationsTable } from "@workspace/db/schema";
import { eq, isNull } from "drizzle-orm";
import { requireAuth, type AuthPayload } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.get("/enquiries/:id/replies", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const auth = res.locals["auth"] as AuthPayload;
  try {
    if (auth.role !== "admin") {
      const enqs = await db.select({ assignedToId: enquiriesTable.assignedToId }).from(enquiriesTable).where(eq(enquiriesTable.id, id));
      if (!enqs[0] || enqs[0].assignedToId !== auth.workerId) {
        res.status(403).json({ error: "Not assigned to you" });
        return;
      }
    }
    const replies = await db
      .select()
      .from(enquiryRepliesTable)
      .where(eq(enquiryRepliesTable.enquiryId, id))
      .orderBy(enquiryRepliesTable.createdAt);
    res.json(replies);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch replies");
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

router.post("/enquiries/:id/replies", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const auth = res.locals["auth"] as AuthPayload;
  const { body, isInternal } = req.body as { body?: string; isInternal?: boolean };
  if (!body?.trim()) { res.status(400).json({ error: "Reply body required" }); return; }
  try {
    const enqs = await db.select().from(enquiriesTable).where(eq(enquiriesTable.id, id));
    const enquiry = enqs[0];
    if (!enquiry) { res.status(404).json({ error: "Enquiry not found" }); return; }
    if (auth.role !== "admin" && enquiry.assignedToId !== auth.workerId) {
      res.status(403).json({ error: "Not assigned to you" }); return;
    }
    const authorName = auth.role === "admin" ? "Admin" : (auth.workerName ?? "Team Member");
    const created = await db
      .insert(enquiryRepliesTable)
      .values({ enquiryId: id, authorId: auth.workerId ?? null, authorName, authorRole: auth.role, body: body.trim(), isInternal: !!isInternal })
      .returning();
    if (!isInternal) {
      if (auth.role !== "admin") {
        await db.insert(notificationsTable).values({
          workerId: null,
          enquiryId: id,
          type: "reply",
          message: `${authorName} replied on enquiry #${id} (${enquiry.name})`,
        });
      } else if (enquiry.assignedToId) {
        await db.insert(notificationsTable).values({
          workerId: enquiry.assignedToId,
          enquiryId: id,
          type: "reply",
          message: `Admin replied on enquiry #${id} (${enquiry.name})`,
        });
      }
    }
    res.status(201).json(created[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to post reply");
    res.status(500).json({ error: "Failed to post reply" });
  }
});

export default router;
