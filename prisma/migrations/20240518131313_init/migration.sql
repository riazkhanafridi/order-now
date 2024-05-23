/*
  Warnings:

  - You are about to drop the column `categpryId` on the `sub_category` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `sub_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sub_category` DROP FOREIGN KEY `sub_category_categpryId_fkey`;

-- AlterTable
ALTER TABLE `sub_category` DROP COLUMN `categpryId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `sub_category_categoryId_idx` ON `sub_category`(`categoryId`);

-- AddForeignKey
ALTER TABLE `sub_category` ADD CONSTRAINT `sub_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
