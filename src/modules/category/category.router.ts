import express from 'express';
import { categoryController } from './category.controller';
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", categoryController.createCategory)

export const categoryRouter = router;