import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { enquiriesTable, insertEnquirySchema, notificationsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin, requireAuth, type AuthPayload } from "../middlewares/adminAuth.js";

const VALID_STATUSES = [
  "new",
  "assigned",
  "in-progress",
  "price-sent",
  "awaiting-reply",
  "order-confirmed",
  "dispatched",
  "closed",
];

const router: IRouter = Router();

router.post("/enquiries", async (req, res) => {
  const parsed = insertEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }
  try {
    const enquiry = await db.insert(enquiriesTable).values(parsed.data).returning();
    const created = enquiry[0]!;
    await db.insert(notificationsTable).values({
      workerId: null,
      enquiryId: created.id,
      type: "new_enquiry",
      message: `New enquiry #${created.id} from ${created.name}${created.part ? ` — ${created.part}` : ""}`,
    });
    res.json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to save enquiry");
    res.status(500).json({ error: "Failed to save enquiry" });
  }
});

router.get("/enquiries", requireAuth, async (req, res) => {
  const auth = res.locals["auth"] as AuthPayload;
  try {
    let enquiries;
    if (auth.role === "admin") {
      enquiries = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt));
    } else {
      enquiries = await db
        .select()
        .from(enquiriesTable)
        .where(eq(enquiriesTable.assignedToId, auth.workerId!))
        .orderBy(desc(enquiriesTable.createdAt));
    }
    res.json(enquiries);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch enquiries");
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

router.patch("/enquiries/:id/status", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  const { status } = req.body as { status?: string };
  if (isNaN(id) || !VALID_STATUSES.includes(status ?? "")) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const updated = await db
      .update(enquiriesTable)
      .set({ status: status! })
      .where(eq(enquiriesTable.id, id))
      .returning();
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update status");
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.patch("/enquiries/:id/assign", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  const { assignedToId, assignedToName } = req.body as {
    assignedToId?: number | null;
    assignedToName?: string | null;
  };
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const current = await db.select({ status: enquiriesTable.status }).from(enquiriesTable).where(eq(enquiriesTable.id, id));
    const currentStatus = current[0]?.status ?? "new";
    const newStatus = assignedToId && currentStatus === "new" ? "assigned" : currentStatus;
    const updated = await db
      .update(enquiriesTable)
      .set({ assignedToId: assignedToId ?? null, assignedToName: assignedToName ?? null, status: newStatus })
      .where(eq(enquiriesTable.id, id))
      .returning();
    if (assignedToId && assignedToName) {
      await db.insert(notificationsTable).values({
        workerId: assignedToId,
        enquiryId: id,
        type: "assigned",
        message: `You've been assigned enquiry #${id} (${updated[0]?.name ?? ""})`,
      });
    }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to assign enquiry");
    res.status(500).json({ error: "Failed to assign enquiry" });
  }
});

export default router;
