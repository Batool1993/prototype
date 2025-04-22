import { injectable, inject } from "tsyringe";
import { IPlaceRepository } from "../../domain/repos/IPlaceRepo";
import { Place } from "../../domain/models/place";

@injectable()
export class PlaceService {
  constructor(
    @inject("IPlaceRepository") private placeRepo: IPlaceRepository
  ) {}

  async createPlace(data: {
    name: string;
    description?: string;
    category?: string;
    latitude: number;
    longitude: number;
  }): Promise<Place> {
    const place = new Place({
      name: data.name,
      description: data.description,
      category: data.category,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    return await this.placeRepo.create(place);
  }

  async getPlaceById(id: number): Promise<Place | null> {
    return await this.placeRepo.findById(id);
  }

  async getNearbyPlaces(query: {
    latitude: number;
    longitude: number;
    radius: number;
  }): Promise<(Place & { distance: number })[]> {
    return await this.placeRepo.findNearby(
      query.latitude,
      query.longitude,
      query.radius
    );
  }

  async getRoute(
    startId: number,
    endId: number
  ): Promise<{ route: Place[]; distanceInMeters: number } | null> {
    const places = await this.placeRepo.findByIds([startId, endId]);
    if (places.length < 2) return null;
    const [a, b] = places;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const angle =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
    const distance = R * c;
    return { route: [a, b], distanceInMeters: distance };
  }
}
