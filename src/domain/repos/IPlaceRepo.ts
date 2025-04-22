import { Place } from "../models/place";

export interface IPlaceRepository {
  create(place: Place): Promise<Place>;
  findById(id: number): Promise<Place | null>;
  findNearby(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<(Place & { distance: number })[]>;
  findByIds(ids: number[]): Promise<Place[]>;
}
