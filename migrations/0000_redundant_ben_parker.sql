CREATE TABLE `ep_catalog` (
	`id` char(21) NOT NULL,
	`shopId` char(21) NOT NULL,
	`name` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ep_catalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ep_catalogProduct` (
	`catalogId` char(21) NOT NULL,
	`productId` char(21) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ep_catalogProduct_catalogId_productId` PRIMARY KEY(`catalogId`,`productId`)
);
--> statement-breakpoint
CREATE TABLE `ep_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	CONSTRAINT `ep_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ep_product` (
	`id` char(21) NOT NULL,
	`shopId` char(21) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(500) NOT NULL,
	`image` varchar(36) NOT NULL,
	`price` double NOT NULL,
	`condition` enum('new','used') NOT NULL DEFAULT 'new',
	`stock` int,
	`categoryId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ep_product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ep_shop` (
	`id` char(21) NOT NULL,
	`userId` varchar(100) NOT NULL,
	`name` varchar(256) NOT NULL,
	`location` varchar(100) NOT NULL,
	`image` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ep_shop_id` PRIMARY KEY(`id`),
	CONSTRAINT `ep_shop_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `ep_product` (`name`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `ep_shop` (`name`);--> statement-breakpoint
ALTER TABLE `ep_catalog` ADD CONSTRAINT `ep_catalog_shopId_ep_shop_id_fk` FOREIGN KEY (`shopId`) REFERENCES `ep_shop`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD CONSTRAINT `ep_catalogProduct_catalogId_ep_catalog_id_fk` FOREIGN KEY (`catalogId`) REFERENCES `ep_catalog`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD CONSTRAINT `ep_catalogProduct_productId_ep_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `ep_product`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_product` ADD CONSTRAINT `ep_product_shopId_ep_shop_id_fk` FOREIGN KEY (`shopId`) REFERENCES `ep_shop`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_product` ADD CONSTRAINT `ep_product_categoryId_ep_category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `ep_category`(`id`) ON DELETE no action ON UPDATE no action;