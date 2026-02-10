import express from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLES } from "../../shared";
import { categoryController } from "./category.controller";
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post("/", auth(ROLES.ADMIN), categoryController.createCategory);
router.put("/:id", auth(ROLES.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(ROLES.ADMIN), categoryController.deleteCategory);

export const categoryRouter = router;
