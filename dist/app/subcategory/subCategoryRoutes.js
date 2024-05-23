"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = __importDefault(require("../../middlewares/protect"));
const subCategoryController_1 = require("./subCategoryController");
const subCategoryRoutes = express_1.default.Router();
subCategoryRoutes.get("/subcategory", subCategoryController_1.getAllSubCategory);
subCategoryRoutes.post("/subcategory", protect_1.default, subCategoryController_1.createSubCategory);
subCategoryRoutes.patch("/subcategory/:id", protect_1.default, subCategoryController_1.updateSubCategory);
subCategoryRoutes.delete("/subcategory/:id", protect_1.default, subCategoryController_1.deleteSubCategory);
exports.default = subCategoryRoutes;
