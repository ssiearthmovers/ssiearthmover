import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  partNumber: text("part_number").notNull().unique(),
  brand: text("brand"),
  model: text("model"),
  category: text("category"),
  categorySlug: text("category_slug"),
  oemNumber: text("oem_number"),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull().default("pcs"),
  rackLocation: text("rack_location"),
  warehouse: text("warehouse"),
  photoUrl: text("photo_url"),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(5),
  status: text("status").notNull().default("out-of-stock"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;
