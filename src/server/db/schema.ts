// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
  double,
  primaryKey,
  mysqlEnum,
  int,
  char,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `ep_${name}`);

export const shops = mysqlTable(
  "shop",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: varchar("userId", { length: 100 }).unique().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    location: varchar("location", { length: 100 }).notNull(),
    image: varchar("image", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt")
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
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (product) => ({
    nameIndex: index("name_idx").on(product.name),
  }),
);

export const catalog = mysqlTable("catalog", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shopId: bigint("shopId", { mode: "number" })
    .references(() => shops.id)
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const catalogProducts = mysqlTable(
  "catalogProduct",
  {
    catalogId: bigint("catalogId", { mode: "number" })
      .references(() => catalog.id)
      .notNull(),
    productId: bigint("productId", { mode: "number" })
      .references(() => products.id)
      .notNull(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    condition: mysqlEnum("condition", ["new", "used"]).notNull().default("new"),
    stock: int("stock"),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (catalogProduct) => ({
    collectionProductPK: primaryKey(
      catalogProduct.catalogId,
      catalogProduct.productId,
    ),
  }),
);

export const category = mysqlTable("category", {
  id: char("id", { length: 21 }),
  name: varchar("name", { length: 50 }),
});

export const shopRelations = relations(shops, ({ many }) => ({
  catalogs: many(catalog),
}));

export const catalogRelations = relations(catalog, ({ many, one }) => ({
  products: many(catalogProducts),
  shop: one(shops, {
    fields: [catalog.shopId],
    references: [shops.id],
  }),
}));

export const catalogProductRelations = relations(
  catalogProducts,
  ({ one }) => ({
    catalog: one(catalog, {
      fields: [catalogProducts.catalogId],
      references: [catalog.id],
    }),
  }),
);
