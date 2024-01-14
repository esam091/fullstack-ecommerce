CREATE TABLE `ep_category` (
	`id` char(21),
	`name` varchar(50)
);
--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD `condition` enum('new','used') DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `ep_catalogProduct` ADD `stock` int;