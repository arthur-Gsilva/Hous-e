import { Router } from "express";
import { createProductController, deleteProductController, getAllProductController, getOneProductController, updateProductController } from "../controllers/products";
import { adminMiddleware, authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";


const productRoutes = Router();

productRoutes.get('/:id', getOneProductController);
productRoutes.get("/", getAllProductController);
productRoutes.post('/', upload.single("image"), authMiddleware, adminMiddleware, createProductController)
productRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteProductController)
productRoutes.put('/:id', authMiddleware, adminMiddleware, updateProductController)

export default productRoutes;

