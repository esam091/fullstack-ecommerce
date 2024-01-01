// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  double,
  primaryKey,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `ecomm-portfolio_${name}`,
);

export const shops = mysqlTable(
  "shop",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: varchar("userId", { length: 100 }).unique().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    location: varchar("location", { length: 100 }).notNull(),
    image: varchar("image", { length: 100 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const products = mysqlTable(
  "product",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    shopId: bigint("shopId", { mode: "number" })
      .references(() => shops.id)
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    image: varchar("image", { length: 36 }).notNull(),
    price: double("price").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (product) => ({
    nameIndex: index("name_idx").on(product.name),
  }),
);

export const collections = mysqlTable("collections", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shopId: bigint("shopId", { mode: "number" })
    .references(() => shops.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const collectionProducts = mysqlTable(
  "collection_product",
  {
    collectionId: bigint("collectionId", { mode: "number" })
      .references(() => collections.id)
      .notNull(),
    productId: bigint("productId", { mode: "number" })
      .references(() => products.id)
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (collectionProduct) => ({
    collectionProductPK: primaryKey(
      collectionProduct.collectionId,
      collectionProduct.productId,
    ),
  }),
);
