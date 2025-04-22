"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const PlaceController_1 = require("./PlaceController");
const auth_1 = require("../controllers/middleware/auth");
const metrics_1 = require("../controllers/middleware/metrics");
const router = (0, express_1.Router)();
const placeController = tsyringe_1.container.resolve(PlaceController_1.PlaceController);
// Public endpoints
router.get("/health", (req, res) => res.status(200).json({ status: "ok", timestamp: new Date().toISOString() }));
router.get("/metrics", metrics_1.metrics);
// Apply authentication middleware for the following routes
router.use(auth_1.requireAuth);
router.post("/places", (req, res) => placeController.createPlace(req, res));
router.get("/places/nearby", (req, res) => placeController.getNearbyPlaces(req, res));
router.get("/places/:id", (req, res) => placeController.getPlace(req, res));
router.get("/route", (req, res) => placeController.getRoute(req, res));
exports.default = router;
