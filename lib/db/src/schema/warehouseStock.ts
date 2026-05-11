import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { productsTable } from "./products";

export const warehouseStockTable = pgTable("warehouse_stock", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  warehouse: text("warehouse").notNull(),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [unique().on(t.productId, t.warehouse)]);

export type WarehouseStock = typeof warehouseStockTable.$inferSelect;
export type InsertWarehouseStock = typeof warehouseStockTable.$inferInsert;
