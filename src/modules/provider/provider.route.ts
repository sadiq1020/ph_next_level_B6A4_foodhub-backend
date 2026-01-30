import express from 'express';
import { providerController } from './provider.controller';
// import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/", providerController.createProviderProfile)

export const providerRouter = router;