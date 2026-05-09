import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, hashPassword } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

const SAFE_COLS = {
  id: workersTable.id,
  name: workersTable.name,
  username: workersTable.username,
  role: workersTable.role,
  isActive: workersTable.isActive,
  createdAt: workersTable.createdAt,
};

router.get("/workers", requireAdmin, async (req, res) => {
  try {
    const workers = await db.select(SAFE_COLS).from(workersTable).orderBy(workersTable.createdAt);
    res.json(workers);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch workers");
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

router.post("/workers", requireAdmin, async (req, res) => {
  const { name, username, password, role } = req.body as {
    name?: string;
    username?: string;
    password?: string;
    role?: string;
  };
  if (!name || !username || !password) {
    res.status(400).json({ error: "Name, username, and password are required" });
    return;
  }
  const workerRole = role === "admin" ? "admin" : "worker";
  try {
    const created = await db
      .insert(workersTable)
      .values({ name, username: username.toLowerCase(), passwordHash: hashPassword(password), role: workerRole })
      .returning(SAFE_COLS);
    res.status(201).json(created[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
    req.log.error({ err }, "Failed to create worker");
    res.status(500).json({ error: "Failed to create worker" });
  }
});

router.patch("/workers/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { name, isActive, password } = req.body as { name?: string; isActive?: boolean; password?: string };
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates["name"] = name;
  if (isActive !== undefined) updates["isActive"] = isActive;
  if (password) updates["passwordHash"] = hashPassword(password);
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "Nothing to update" }); return; }
  try {
    const updated = await db.update(workersTable).set(updates).where(eq(workersTable.id, id)).returning(SAFE_COLS);
    if (!updated[0]) { res.status(404).json({ error: "Worker not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update worker");
    res.status(500).json({ error: "Failed to update worker" });
  }
});

router.delete("/workers/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"] ?? ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    await db.delete(workersTable).where(eq(workersTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete worker");
    res.status(500).json({ error: "Failed to delete worker" });
  }
});

export default router;
