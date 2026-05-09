import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken, hashPassword } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "Admin password not configured. Set ADMIN_PASSWORD env var." });
    return;
  }
  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = signToken({
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token, role: "admin", name: "Admin" });
});

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username.toLowerCase() === "admin") {
    if (!adminPassword || password !== adminPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({
      role: "admin",
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ token, role: "admin", name: "Admin" });
    return;
  }

  try {
    const workers = await db
      .select()
      .from(workersTable)
      .where(eq(workersTable.username, username.toLowerCase()));
    const worker = workers[0];
    if (!worker || !worker.isActive) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const hash = hashPassword(password);
    if (hash !== worker.passwordHash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({
      role: worker.role,
      workerId: worker.id,
      workerName: worker.name,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ token, role: worker.role, name: worker.name, workerId: worker.id });
  } catch (err) {
    req.log.error({ err }, "Worker login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
