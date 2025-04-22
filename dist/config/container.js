"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const PlaceRepository_1 = require("../storage/PlaceRepository");
// Register the IPlaceRepository dependency to be resolved with PlaceRepository.
tsyringe_1.container.register("IPlaceRepository", {
    useClass: PlaceRepository_1.PlaceRepository,
});
