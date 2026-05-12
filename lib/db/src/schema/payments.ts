import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";
import { invoicesTable } from "./invoices";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoicesTable.id, { onDelete: "cascade" }),
  customerId: integer("customer_id").notNull().references(() => customersTable.id),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  paymentMethod: text("payment_method").notNull().default("cash"),
  referenceNumber: text("reference_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true });
export type Payment = typeof paymentsTable.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
