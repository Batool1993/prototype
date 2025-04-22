"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
const tsyringe_1 = require("tsyringe");
const PlaceService_1 = require("../domain/services/PlaceService");
let PlaceController = class PlaceController {
    constructor() {
        this.placeService = tsyringe_1.container.resolve(PlaceService_1.PlaceService);
    }
    createPlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, category, latitude, longitude } = req.body;
                if (!name || latitude === undefined || longitude === undefined) {
                    res
                        .status(400)
                        .json({
                        error: "Missing required fields: name, latitude, longitude",
                    });
                    return;
                }
                const place = yield this.placeService.createPlace({
                    name,
                    description,
                    category,
                    latitude,
                    longitude,
                });
                res.status(201).json(place);
            }
            catch (error) {
                console.error("Error in createPlace:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getPlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const place = yield this.placeService.getPlaceById(id);
                if (!place) {
                    res.status(404).json({ error: "Place not found" });
                    return;
                }
                res.json(place);
            }
            catch (error) {
                console.error("Error in getPlace:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getNearbyPlaces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latitude = Number(req.query.latitude);
                const longitude = Number(req.query.longitude);
                const radius = Number(req.query.radius);
                if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
                    res
                        .status(400)
                        .json({
                        error: "Missing or invalid query parameters: latitude, longitude, radius",
                    });
                    return;
                }
                const places = yield this.placeService.getNearbyPlaces({
                    latitude,
                    longitude,
                    radius,
                });
                res.json(places);
            }
            catch (error) {
                console.error("Error in getNearbyPlaces:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = Number(req.query.start);
                const end = Number(req.query.end);
                if (isNaN(start) || isNaN(end)) {
                    res
                        .status(400)
                        .json({ error: "Missing or invalid query parameters: start, end" });
                    return;
                }
                const routeResult = yield this.placeService.getRoute(start, end);
                if (!routeResult) {
                    res.status(404).json({ error: "Start or end place not found" });
                    return;
                }
                res.json(routeResult);
            }
            catch (error) {
                console.error("Error in getRoute:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
};
exports.PlaceController = PlaceController;
exports.PlaceController = PlaceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], PlaceController);
