import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";
import { productsTable } from "./products";

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id),
  customerName: text("customer_name").notNull(),
  customerCompany: text("customer_company"),
  customerPhone: text("customer_phone"),
  customerGstin: text("customer_gstin"),
  customerAddress: text("customer_address"),
  invoiceDate: timestamp("invoice_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("unpaid"),
  subtotal: integer("subtotal").notNull().default(0),
  taxPercent: integer("tax_percent").notNull().default(18),
  taxAmount: integer("tax_amount").notNull().default(0),
  totalAmount: integer("total_amount").notNull().default(0),
  paidAmount: integer("paid_amount").notNull().default(0),
  deductStock: boolean("deduct_stock").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoiceItemsTable = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoicesTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => productsTable.id),
  partNumber: text("part_number"),
  partName: text("part_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull().default(0),
  amount: integer("amount").notNull().default(0),
});

export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({
  id: true, createdAt: true, status: true, paidAmount: true,
});
export const insertInvoiceItemSchema = createInsertSchema(invoiceItemsTable).omit({ id: true });

export type Invoice = typeof invoicesTable.$inferSelect;
export type InvoiceItem = typeof invoiceItemsTable.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
