import { Router } from "express";
import { cartMountController, finishCartController } from "../controllers/cart";
import { authMiddleware } from "../middlewares/auth";

const cartRoutes = Router();

cartRoutes.post("/mount", cartMountController);
cartRoutes.post("/finish", authMiddleware, finishCartController);

export default cartRoutes;
