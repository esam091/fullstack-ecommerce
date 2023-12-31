ALTER TABLE `ecomm-portfolio_product` MODIFY COLUMN `shopId` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_product` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_product` MODIFY COLUMN `description` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_product` MODIFY COLUMN `image` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_product` MODIFY COLUMN `price` double NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_shop` MODIFY COLUMN `userId` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_shop` MODIFY COLUMN `name` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_shop` MODIFY COLUMN `location` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `ecomm-portfolio_shop` MODIFY COLUMN `image` varchar(100) NOT NULL;