import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const importHistoryTable = pgTable("import_history", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  totalRows: integer("total_rows").notNull().default(0),
  inserted: integer("inserted").notNull().default(0),
  updated: integer("updated").notNull().default(0),
  skipped: integer("skipped").notNull().default(0),
  errors: text("errors"),
  actorName: text("actor_name").notNull().default("Admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ImportHistory = typeof importHistoryTable.$inferSelect;
export type InsertImportHistory = typeof importHistoryTable.$inferInsert;
