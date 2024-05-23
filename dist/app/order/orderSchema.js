"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSchema = void 0;
const zod_1 = require("zod");
exports.orderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING",
        "ACCEPTED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ]),
});
