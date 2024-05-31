DO $$ BEGIN
 CREATE TYPE "productCondition" AS ENUM('new', 'used');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ep_catalog" (
	"id" char(21) PRIMARY KEY NOT NULL,
	"shopId" char(21) NOT NULL,
	"name" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ep_catalogProduct" (
	"catalogId" char(21) NOT NULL,
	"productId" char(21) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT ep_catalogProduct_catalogId_productId PRIMARY KEY("catalogId","productId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ep_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ep_product" (
	"id" char(21) PRIMARY KEY NOT NULL,
	"shopId" char(21) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500) NOT NULL,
	"image" varchar(36) NOT NULL,
	"price" integer NOT NULL,
	"condition" "productCondition" DEFAULT 'new' NOT NULL,
	"stock" integer,
	"categoryId" integer NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ep_shop" (
	"id" char(21) PRIMARY KEY NOT NULL,
	"userId" varchar(100) NOT NULL,
	"name" varchar(256) NOT NULL,
	"location" varchar(100) NOT NULL,
	"image" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "ep_shop_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ep_product" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ep_shop" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ep_catalog" ADD CONSTRAINT "ep_catalog_shopId_ep_shop_id_fk" FOREIGN KEY ("shopId") REFERENCES "ep_shop"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ep_catalogProduct" ADD CONSTRAINT "ep_catalogProduct_catalogId_ep_catalog_id_fk" FOREIGN KEY ("catalogId") REFERENCES "ep_catalog"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ep_catalogProduct" ADD CONSTRAINT "ep_catalogProduct_productId_ep_product_id_fk" FOREIGN KEY ("productId") REFERENCES "ep_product"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ep_product" ADD CONSTRAINT "ep_product_shopId_ep_shop_id_fk" FOREIGN KEY ("shopId") REFERENCES "ep_shop"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ep_product" ADD CONSTRAINT "ep_product_categoryId_ep_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "ep_category"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
