-- CreateTable
CREATE TABLE `sub_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categpryId` INTEGER NOT NULL,

    UNIQUE INDEX `sub_category_name_key`(`name`),
    INDEX `sub_category_categpryId_idx`(`categpryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_category` ADD CONSTRAINT `sub_category_categpryId_fkey` FOREIGN KEY (`categpryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
