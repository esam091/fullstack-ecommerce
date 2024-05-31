// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  primaryKey,
  integer,
  char,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgsqlTable = pgTableCreator((name) => `ep_${name}`);

function nanoid(name: string) {
  return char(name, { length: 21 });
}

export const shops = pgsqlTable(
  "shop",
  {
    id: nanoid("id").primaryKey(),
    userId: varchar("userId", { length: 100 }).unique().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    location: varchar("location", { length: 100 }).notNull(),
    image: varchar("image", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const conditionEnum = pgEnum("productCondition", ["new", "used"]);

export const products = pgsqlTable(
  "product",
  {
    id: nanoid("id").primaryKey(),
    shopId: nanoid("shopId")
      .references(() => shops.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    image: varchar("image", { length: 36 }).notNull(),
    price: integer("price").notNull(),
    condition: conditionEnum("condition").notNull().default("new"),
    stock: integer("stock"),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id, {
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (product) => ({
    nameIndex: index("name_idx").on(product.name),
  }),
);

export const catalog = pgsqlTable("catalog", {
  id: nanoid("id").primaryKey(),
  shopId: nanoid("shopId")
    .references(() => shops.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const catalogProducts = pgsqlTable(
  "catalogProduct",
  {
    catalogId: nanoid("catalogId")
      .references(() => catalog.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    productId: nanoid("productId")
      .references(() => products.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (catalogProduct) => ({
    collectionProductPK: primaryKey(
      catalogProduct.catalogId,
      catalogProduct.productId,
    ),
  }),
);

export const categories = pgsqlTable("category", {
  id: serial("id").primaryKey(),
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
