import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  gstin: text("gstin"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  creditLimit: integer("credit_limit").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true });
export type Customer = typeof customersTable.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
