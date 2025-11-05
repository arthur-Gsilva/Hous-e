import { Router } from "express";
import { getAllOrdersController, getOneOrderController, updateOrderStatusController } from "../controllers/order";
import { authMiddleware } from "../middlewares/auth";

const orderRoutes = Router();

//GET
orderRoutes.get("/", authMiddleware, getAllOrdersController);
orderRoutes.post("/status", authMiddleware, updateOrderStatusController);

orderRoutes.get("/:id", authMiddleware, getOneOrderController)

export default orderRoutes