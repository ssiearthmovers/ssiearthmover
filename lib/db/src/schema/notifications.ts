import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { workersTable } from "./workers";
import { enquiriesTable } from "./enquiries";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => workersTable.id, { onDelete: "cascade" }),
  enquiryId: integer("enquiry_id").references(() => enquiriesTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("new_enquiry"),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;
export type InsertNotification = typeof notificationsTable.$inferInsert;
