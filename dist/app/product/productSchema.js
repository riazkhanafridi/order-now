"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(20),
    price: zod_1.z.number(),
    stock: zod_1.z.number(),
    categoryId: zod_1.z.number(),
    subCategoryId: zod_1.z.number(),
});
