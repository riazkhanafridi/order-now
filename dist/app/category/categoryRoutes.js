"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("./categoryController");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const Uploads_1 = require("../../utils/Uploads");
const categoryRoutes = express_1.default.Router();
categoryRoutes.get("/category", protect_1.default, categoryController_1.getAllCategory);
categoryRoutes.post("/category", Uploads_1.uploadFiles.single("image"), protect_1.default, categoryController_1.createCategory);
categoryRoutes.patch("/category/:id", Uploads_1.uploadFiles.single("image"), protect_1.default, categoryController_1.updateCategory);
categoryRoutes.delete("/category/:id", protect_1.default, categoryController_1.deleteCategory);
exports.default = categoryRoutes;
