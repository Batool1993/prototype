"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
const node_test_1 = require("node:test");
const AUTH_TOKEN = process.env.AUTH_TOKEN || "testtoken";
(0, node_test_1.describe)("Places API", () => {
    let createdPlaceId;
    (0, node_test_1.it)("should create a new place", () => __awaiter(void 0, void 0, void 0, function* () {
        const newPlace = {
            name: "Test Park",
            description: "A lovely park for testing",
            category: "Park",
            latitude: 37.7749,
            longitude: -122.4194,
        };
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/api/places")
            .set("Authorization", `Bearer ${AUTH_TOKEN}`)
            .send(newPlace);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        createdPlaceId = response.body.id;
    }));
    (0, node_test_1.it)("should retrieve the newly created place", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get(`/api/places/${createdPlaceId}`)
            .set("Authorization", `Bearer ${AUTH_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdPlaceId);
    }));
    (0, node_test_1.it)("should search for nearby places", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/api/places/nearby")
            .set("Authorization", `Bearer ${AUTH_TOKEN}`)
            .query({
            latitude: 37.7749,
            longitude: -122.4194,
            radius: 5000,
        });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    (0, node_test_1.it)("should return a stubbed route between two places", () => __awaiter(void 0, void 0, void 0, function* () {
        const secondPlace = {
            name: "Test Library",
            description: "A testing library",
            category: "Library",
            latitude: 37.78,
            longitude: -122.42,
        };
        const resCreate = yield (0, supertest_1.default)(index_1.default)
            .post("/api/places")
            .set("Authorization", `Bearer ${AUTH_TOKEN}`)
            .send(secondPlace);
        expect(resCreate.status).toBe(201);
        const secondPlaceId = resCreate.body.id;
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/api/route")
            .set("Authorization", `Bearer ${AUTH_TOKEN}`)
            .query({
            start: createdPlaceId,
            end: secondPlaceId,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("route");
        expect(response.body).toHaveProperty("distanceInMeters");
    }));
});
