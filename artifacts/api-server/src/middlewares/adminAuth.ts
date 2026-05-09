import { createHmac } from "crypto";
import type { Request, Response, NextFunction } from "express";

const SECRET = process.env.SESSION_SECRET ?? "dev-fallback-secret";

export interface AuthPayload {
  role: string;
  workerId?: number;
  workerName?: string;
  iat: number;
  exp: number;
}

export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): { valid: boolean; payload?: AuthPayload } {
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return { valid: false };
  const data = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expected = createHmac("sha256", SECRET).update(data).digest("hex");
  if (sig !== expected) return { valid: false };
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString(),
    ) as AuthPayload;
    if (payload.exp && Date.now() > payload.exp) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export function hashPassword(password: string): string {
  return createHmac("sha256", SECRET).update(password).digest("hex");
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const result = verifyToken(token);
  if (!result.valid || !result.payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  res.locals["auth"] = result.payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    const payload = res.locals["auth"] as AuthPayload | undefined;
    if (payload?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}
