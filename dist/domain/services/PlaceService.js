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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.PlaceService = void 0;
const tsyringe_1 = require("tsyringe");
const place_1 = require("../../domain/models/place");
let PlaceService = class PlaceService {
    constructor(placeRepo) {
        this.placeRepo = placeRepo;
    }
    createPlace(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = new place_1.Place({
                name: data.name,
                description: data.description,
                category: data.category,
                latitude: data.latitude,
                longitude: data.longitude,
            });
            return yield this.placeRepo.create(place);
        });
    }
    getPlaceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.placeRepo.findById(id);
        });
    }
    getNearbyPlaces(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.placeRepo.findNearby(query.latitude, query.longitude, query.radius);
        });
    }
    getRoute(startId, endId) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield this.placeRepo.findByIds([startId, endId]);
            if (places.length < 2)
                return null;
            const [a, b] = places;
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371000;
            const dLat = toRad(b.latitude - a.latitude);
            const dLon = toRad(b.longitude - a.longitude);
            const lat1 = toRad(a.latitude);
            const lat2 = toRad(b.latitude);
            const angle = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
            const c = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
            const distance = R * c;
            return { route: [a, b], distanceInMeters: distance };
        });
    }
};
exports.PlaceService = PlaceService;
exports.PlaceService = PlaceService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IPlaceRepository")),
    __metadata("design:paramtypes", [Object])
], PlaceService);
