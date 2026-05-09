import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const workersTable = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("worker"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Worker = typeof workersTable.$inferSelect;
export type InsertWorker = typeof workersTable.$inferInsert;
