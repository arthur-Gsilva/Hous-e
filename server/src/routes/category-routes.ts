import { Router } from "express";
import { getRelatedProductsController } from "../controllers/products";
import { addCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/category";
import { adminMiddleware, authMiddleware } from "../middlewares/auth";

const categoryRoutes = Router();

categoryRoutes.get("/:id/products", getRelatedProductsController);
categoryRoutes.post("/", authMiddleware, adminMiddleware, addCategoryController);
categoryRoutes.get("/", authMiddleware, getAllCategoriesController);
categoryRoutes.put('/:id', authMiddleware, adminMiddleware, updateCategoryController)

export default categoryRoutes