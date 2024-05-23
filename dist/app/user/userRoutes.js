"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Uploads_1 = require("../../utils/Uploads");
const protect_1 = __importDefault(require("../../middlewares/protect"));
const userController_1 = require("./userController");
const routes = express_1.default.Router();
routes.get("/shopkeeper", userController_1.getAllShopKeepers);
routes.get("/get-shopkeeper-by-status", userController_1.getShopkeeperByStatus);
routes.post("/shopkeeper", Uploads_1.uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
]), userController_1.createShopKeeper);
routes.patch("/user-status/:id", protect_1.default, userController_1.updateShopKeeperStatus);
routes.post("/login", userController_1.loginUser);
routes.patch("/shopkeeper/:id", Uploads_1.uploadFiles.fields([
    { name: "image", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
]), protect_1.default, userController_1.updateShopKeeper);
routes.delete("/shopkeeper/:id", protect_1.default, userController_1.deleteShopKeeper);
exports.default = routes;
