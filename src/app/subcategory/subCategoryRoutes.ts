import express from "express";

import { uploadFiles } from "../../utils/Uploads";
import protect from "../../middlewares/protect";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  updateSubCategory,
} from "./subCategoryController";

const subCategoryRoutes: any = express.Router();

subCategoryRoutes.get("/subcategory", getAllSubCategory);
subCategoryRoutes.post("/subcategory", protect, createSubCategory);
subCategoryRoutes.patch("/subcategory/:id", protect, updateSubCategory);
subCategoryRoutes.delete("/subcategory/:id", protect, deleteSubCategory);

export default subCategoryRoutes;
