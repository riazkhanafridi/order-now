import express from "express";

import userRoute from "./app/user/userRoutes";
import categoryRoutes from "./app/category/categoryRoutes";
import subCategoryRoutes from "./app/subcategory/subCategoryRoutes";
import productsRoutes from "./app/product/productRoutes";
import cartRoutes from "./app/addToCart/cartRoutes";
import orderRoutes from "./app/order/orderRoutes";
import errorHandler from "./middlewares/errorHandling";

const app = express();

const port = process.env.PORT || 3004;
app.use(express.json());

app.use("/", express.static("uploads"));

app.use("/api/v1", userRoute);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", subCategoryRoutes);
app.use("/api/v1", productsRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

app.use(errorHandler as any);

app.listen(port, () => console.log("app runs on port " + port));
