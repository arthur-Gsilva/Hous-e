import { Router } from "express";
import { registerUserController, loginController, getAddressesController, addAddressController, favoriteProductController, getFavoritesProductsController, getProfileController, logoutController } from "../controllers/user";
import { authMiddleware } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginController);
userRoutes.post('/logout', authMiddleware, logoutController)

userRoutes.get("/addresses", authMiddleware, getAddressesController);
userRoutes.get("/favorites", authMiddleware, getFavoritesProductsController)
userRoutes.get("/profile", authMiddleware, getProfileController)

userRoutes.post("/address", authMiddleware, addAddressController);
userRoutes.post("/favorite/:productId", authMiddleware, favoriteProductController)

export default userRoutes;
