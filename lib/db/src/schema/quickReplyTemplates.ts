import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const quickReplyTemplatesTable = pgTable("quick_reply_templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type QuickReplyTemplate = typeof quickReplyTemplatesTable.$inferSelect;
export type InsertQuickReplyTemplate = typeof quickReplyTemplatesTable.$inferInsert;
