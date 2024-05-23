"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("./productController");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const isAdmin_1 = __importDefault(require("../../middlewares/isAdmin"));
const Uploads_1 = require("../../utils/Uploads");
const productsRoutes = (0, express_1.Router)();
productsRoutes.post("/product", [protect_1.default, isAdmin_1.default], Uploads_1.uploadFiles.array("image"), productController_1.createProduct);
productsRoutes.patch("/product/:id", [protect_1.default, isAdmin_1.default], productController_1.updateProduct);
productsRoutes.delete("/product/:id", [protect_1.default, isAdmin_1.default], productController_1.deleteProduct);
productsRoutes.get("/product", productController_1.getProducts);
productsRoutes.get("/product/search", productController_1.searchProducts);
productsRoutes.get("/product/:id", productController_1.getProductById);
exports.default = productsRoutes;
