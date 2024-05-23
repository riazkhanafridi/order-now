import { Router } from "express";
import authMiddleware from "../../middlewares/protect";
import {
  addItemToCart,
  changeQuantity,
  deleteItemFromCart,
  getCart,
} from "./cartController";

const cartRoutes: any = Router();

cartRoutes.post("/cart", [authMiddleware], addItemToCart);
cartRoutes.get("/cart", [authMiddleware], getCart);

cartRoutes.delete("/cart/:id", [authMiddleware], deleteItemFromCart);

cartRoutes.patch("/cart/:id", [authMiddleware], changeQuantity);

export default cartRoutes;
