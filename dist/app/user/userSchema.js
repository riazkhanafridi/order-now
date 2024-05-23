"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopKeeperStatusSchema = exports.loginUserSchema = exports.shopKeeperSchema = void 0;
const zod_1 = require("zod");
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpeg",
    "image/jpeg",
    "image/webp",
];
exports.shopKeeperSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phoneNo: zod_1.z.string().min(10).max(15),
    // address: z.number(),
    businessName: zod_1.z.string().min(3).max(30),
    // picture: z.string(),
    // nic_front: z.string(),
    // nic_back: z.string(),
    role: zod_1.z.enum(["SHOPKEEPER", "ADMIN", "DRIVER"]),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["SHOPKEEPER", "ADMIN", "DRIVER"]),
});
exports.updateShopKeeperStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "APPROVE", "REJECT", "BLOCK"]),
});
