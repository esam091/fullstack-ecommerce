RENAME TABLE `ep_collection_product` TO `ep_catalogProduct`;--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` DROP FOREIGN KEY `ep_collection_product_catalogId_ep_catalog_id_fk`;
--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` DROP FOREIGN KEY `ep_collection_product_productId_ep_product_id_fk`;
--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD CONSTRAINT `ep_catalogProduct_catalogId_ep_catalog_id_fk` FOREIGN KEY (`catalogId`) REFERENCES `ep_catalog`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD CONSTRAINT `ep_catalogProduct_productId_ep_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `ep_product`(`id`) ON DELETE no action ON UPDATE no action;