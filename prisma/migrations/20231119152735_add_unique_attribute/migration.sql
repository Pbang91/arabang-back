/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tag]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `categories_category_key` ON `categories`(`category`);

-- CreateIndex
CREATE UNIQUE INDEX `tags_tag_key` ON `tags`(`tag`);
