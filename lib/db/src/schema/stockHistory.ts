import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { productsTable } from "./products";
import { enquiriesTable } from "./enquiries";

export const stockHistoryTable = pgTable("stock_history", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  previousQty: integer("previous_qty").notNull(),
  newQty: integer("new_qty").notNull(),
  change: integer("change").notNull(),
  reason: text("reason"),
  relatedEnquiryId: integer("related_enquiry_id").references(() => enquiriesTable.id, { onDelete: "set null" }),
  actorName: text("actor_name").notNull(),
  actorRole: text("actor_role").notNull().default("worker"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type StockHistory = typeof stockHistoryTable.$inferSelect;
export type InsertStockHistory = typeof stockHistoryTable.$inferInsert;
