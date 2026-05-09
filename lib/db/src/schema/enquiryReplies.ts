import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { enquiriesTable } from "./enquiries";
import { workersTable } from "./workers";

export const enquiryRepliesTable = pgTable("enquiry_replies", {
  id: serial("id").primaryKey(),
  enquiryId: integer("enquiry_id").notNull().references(() => enquiriesTable.id, { onDelete: "cascade" }),
  authorId: integer("author_id").references(() => workersTable.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull().default("worker"),
  body: text("body").notNull(),
  isInternal: boolean("is_internal").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type EnquiryReply = typeof enquiryRepliesTable.$inferSelect;
export type InsertEnquiryReply = typeof enquiryRepliesTable.$inferInsert;
