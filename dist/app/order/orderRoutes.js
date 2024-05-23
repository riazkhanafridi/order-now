"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const orderController_1 = require("./orderController");
const isAdmin_1 = __importDefault(require("../../middlewares/isAdmin"));
const orderRoutes = (0, express_1.Router)();
orderRoutes.post("/orders", [protect_1.default], orderController_1.createOrder);
orderRoutes.get("/logged-users-orders", [protect_1.default], orderController_1.getAllLoggedInUserOrders);
orderRoutes.patch("/cancel-orders/:id", [protect_1.default], orderController_1.cancelOrder);
orderRoutes.get("/all-orders", [protect_1.default, isAdmin_1.default], orderController_1.getAllOrders);
orderRoutes.get("/users-orders/:id", [protect_1.default, isAdmin_1.default], orderController_1.getUserOrders);
orderRoutes.patch("/orders/:id/status", [protect_1.default, isAdmin_1.default], orderController_1.changeStatus);
orderRoutes.get("/orders/:id", [protect_1.default], orderController_1.getOrderById);
exports.default = orderRoutes;
