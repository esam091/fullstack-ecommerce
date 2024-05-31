import { getTableColumns, sql } from "drizzle-orm";
import { products } from "./schema";

export const productDisplayColumns = {
  ...getTableColumns(products),
  price: sql<number>`round(${products.price} / 100.0, 2)`,
};
