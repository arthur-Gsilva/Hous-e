import { Router } from "express";
import { addProductToSectionController, addSectionController, getAllSectionsController, getOneSectionController, updateSectionController } from "../controllers/sections";
import { adminMiddleware, authMiddleware } from "../middlewares/auth";

const sectionRoutes = Router();

//GET
sectionRoutes.get("/", getAllSectionsController);
sectionRoutes.get("/:id", getOneSectionController);

//POST
sectionRoutes.post('/', authMiddleware, adminMiddleware, addSectionController)
sectionRoutes.post('/:id', authMiddleware, adminMiddleware, addProductToSectionController)

//PUT
sectionRoutes.put('/:id', authMiddleware, adminMiddleware, updateSectionController)

export default sectionRoutes;
