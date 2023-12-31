CREATE TABLE `ecomm-portfolio_product` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`shopId` bigint,
	`name` varchar(100),
	`description` varchar(500),
	`image` varchar(36),
	`price` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ecomm-portfolio_product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ecomm-portfolio_shop` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` varchar(100),
	`name` varchar(256),
	`location` varchar(100),
	`image` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ecomm-portfolio_shop_id` PRIMARY KEY(`id`),
	CONSTRAINT `ecomm-portfolio_shop_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `ecomm-portfolio_product` (`name`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `ecomm-portfolio_shop` (`name`);--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_product` ADD CONSTRAINT `ecomm-portfolio_product_shopId_ecomm-portfolio_shop_id_fk` FOREIGN KEY (`shopId`) REFERENCES `ecomm-portfolio_shop`(`id`) ON DELETE no action ON UPDATE no action;