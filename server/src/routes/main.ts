import { Router } from "express";

import userRoutes from "./user-routes";
import productRoutes from "./product-routes";
import categoryRoutes from "./category-routes";
import cartRoutes from "./cart-routes";
import sectionRoutes from "./section-routes";
import orderRoutes from "./order-routes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/product", productRoutes);
routes.use("/category", categoryRoutes);
routes.use("/cart", cartRoutes);
routes.use("/section", sectionRoutes);
routes.use('/order', orderRoutes)

export default routes;
