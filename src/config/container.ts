import "reflect-metadata";
import { container } from "tsyringe";
import { IPlaceRepository } from "../domain/repos/IPlaceRepo";
import { PlaceRepository } from "../storage/PlaceRepository";

// Register the IPlaceRepository dependency to be resolved with PlaceRepository.
container.register<IPlaceRepository>("IPlaceRepository", {
  useClass: PlaceRepository,
});
