import express, { Router } from "express";
import { uploadFiles } from "../../utils/Uploads";
import protect from "../../middlewares/protect";
import {
  createShopKeeper,
  deleteShopKeeper,
  getAllShopKeepers,
  getShopkeeperByStatus,
  loginUser,
  updateShopKeeper,
  updateShopKeeperStatus,
} from "./userController";

const routes: any = express.Router();
routes.get("/shopkeeper", getAllShopKeepers);
routes.get("/get-shopkeeper-by-status", getShopkeeperByStatus);
routes.post(
  "/shopkeeper",
  uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
  ]),
  createShopKeeper
);

routes.patch("/user-status/:id", protect, updateShopKeeperStatus);

routes.post("/login", loginUser);
routes.patch(
  "/shopkeeper/:id",
  uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
  ]),
  protect,

  updateShopKeeper
);
routes.delete("/shopkeeper/:id", protect, deleteShopKeeper);

export default routes;
