-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'SHOPKEEPER', 'DRIVER') NOT NULL DEFAULT 'SHOPKEEPER',
    `businessName` VARCHAR(191) NOT NULL,
    `phoneNo` VARCHAR(191) NOT NULL,
    `nicFront` VARCHAR(191) NOT NULL,
    `nicBack` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVE', 'REJECT', 'BLOCK') NOT NULL DEFAULT 'PENDING',
    `defaultShippingAddress` INTEGER NULL,
    `defaultBillingAddress` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
