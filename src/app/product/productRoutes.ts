import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from "./productController";
import protect from "../../middlewares/protect";
import adminMiddleware from "../../middlewares/isAdmin";

import { uploadFiles } from "../../utils/Uploads";

const productsRoutes: any = Router();

productsRoutes.post(
  "/product",
  [protect, adminMiddleware],
  uploadFiles.array("image"),
  createProduct
);

productsRoutes.patch("/product/:id", [protect, adminMiddleware], updateProduct);
productsRoutes.delete(
  "/product/:id",
  [protect, adminMiddleware],
  deleteProduct
);

productsRoutes.get("/product", getProducts);
productsRoutes.get("/product/search", searchProducts);
productsRoutes.get("/product/:id", getProductById);

export default productsRoutes;
