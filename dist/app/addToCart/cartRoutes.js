"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const cartController_1 = require("./cartController");
const cartRoutes = (0, express_1.Router)();
cartRoutes.post("/cart", [protect_1.default], cartController_1.addItemToCart);
cartRoutes.get("/cart", [protect_1.default], cartController_1.getCart);
cartRoutes.delete("/cart/:id", [protect_1.default], cartController_1.deleteItemFromCart);
cartRoutes.patch("/cart/:id", [protect_1.default], cartController_1.changeQuantity);
exports.default = cartRoutes;
