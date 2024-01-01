CREATE TABLE `ecomm-portfolio_collection_product` (
	`collectionId` bigint NOT NULL,
	`productId` bigint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ecomm-portfolio_collection_product_collectionId_productId` PRIMARY KEY(`collectionId`,`productId`)
);
--> statement-breakpoint
CREATE TABLE `ecomm-portfolio_collections` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`shopId` bigint NOT NULL,
	`name` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ecomm-portfolio_collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_collection_product` ADD CONSTRAINT `ecomm-portfolio_collection_product_collectionId_ecomm-portfolio_collections_id_fk` FOREIGN KEY (`collectionId`) REFERENCES `ecomm-portfolio_collections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_collection_product` ADD CONSTRAINT `ecomm-portfolio_collection_product_productId_ecomm-portfolio_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `ecomm-portfolio_product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_collections` ADD CONSTRAINT `ecomm-portfolio_collections_shopId_ecomm-portfolio_shop_id_fk` FOREIGN KEY (`shopId`) REFERENCES `ecomm-portfolio_shop`(`id`) ON DELETE no action ON UPDATE no action;