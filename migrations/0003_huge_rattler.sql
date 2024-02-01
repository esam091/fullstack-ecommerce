-- Custom SQL migration file, put you code below! --
UPDATE ep_shop SET image = CONCAT(image, '.webp');
