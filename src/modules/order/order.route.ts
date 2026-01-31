import express from 'express';
import { orderController } from './order.controller';
import { ROLES } from '../../shared';
import auth from '../../middlewares/auth.middleware';
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", auth(ROLES.CUSTOMER), orderController.createOrder)

export const orderRouter = router;