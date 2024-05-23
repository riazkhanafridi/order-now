import { Router } from "express";
import authMiddleware from "../../middlewares/protect";
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  getAllOrders,
  getAllLoggedInUserOrders,
  getUserOrders,
} from "./orderController";
import adminMiddleware from "../../middlewares/isAdmin";

const orderRoutes: any = Router();

orderRoutes.post("/orders", [authMiddleware], createOrder);
orderRoutes.get(
  "/logged-users-orders",
  [authMiddleware],
  getAllLoggedInUserOrders
);
orderRoutes.patch("/cancel-orders/:id", [authMiddleware], cancelOrder);
orderRoutes.get("/all-orders", [authMiddleware, adminMiddleware], getAllOrders);
orderRoutes.get(
  "/users-orders/:id",
  [authMiddleware, adminMiddleware],
  getUserOrders
);

orderRoutes.patch(
  "/orders/:id/status",
  [authMiddleware, adminMiddleware],
  changeStatus
);
orderRoutes.get("/orders/:id", [authMiddleware], getOrderById);

export default orderRoutes;
