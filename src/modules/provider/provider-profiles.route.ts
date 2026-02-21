import express from "express";
import { providerController } from "./provider.controller";

const router = express.Router();

router.get("/:id", providerController.getProviderById); // Public
router.get("/", providerController.getAllProviders); // Public

export const providerProfilesRouter = router;
