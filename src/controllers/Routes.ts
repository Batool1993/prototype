import { Router } from "express";
import { container } from "tsyringe";
import { PlaceController } from "./PlaceController";
import { requireAuth } from "../controllers/middleware/auth";
import { metrics } from "../controllers/middleware/metrics";

const router = Router();
const placeController = container.resolve(PlaceController);

// Public endpoints
router.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
);
router.get("/metrics", metrics);

// Apply authentication middleware for the following routes
router.use(requireAuth);
router.post("/places", (req, res) => placeController.createPlace(req, res));
router.get("/places/nearby", (req, res) =>
  placeController.getNearbyPlaces(req, res)
);
router.get("/places/:id", (req, res) => placeController.getPlace(req, res));
router.get("/route", (req, res) => placeController.getRoute(req, res));

export default router;
