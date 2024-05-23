import express from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "./categoryController";
import protect from "../../middlewares/protect";

import { uploadFiles } from "../../utils/Uploads";

const categoryRoutes: any = express.Router();

categoryRoutes.get("/category", protect, getAllCategory);

categoryRoutes.post(
  "/category",
  uploadFiles.single("image"),
  protect,

  createCategory
);
categoryRoutes.patch(
  "/category/:id",
  uploadFiles.single("image"),
  protect,

  updateCategory
);

categoryRoutes.delete("/category/:id", protect, deleteCategory);

export default categoryRoutes;
