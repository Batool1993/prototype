import { Request, Response } from "express";
import { injectable, container } from "tsyringe";
import { PlaceService } from "../domain/services/PlaceService";

@injectable()
export class PlaceController {
  private placeService: PlaceService;

  constructor() {
    this.placeService = container.resolve(PlaceService);
  }

  async createPlace(req: Request, res: Response): Promise<void> {
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
      const place = await this.placeService.createPlace({
        name,
        description,
        category,
        latitude,
        longitude,
      });
      res.status(201).json(place);
    } catch (error) {
      console.error("Error in createPlace:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPlace(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const place = await this.placeService.getPlaceById(id);
      if (!place) {
        res.status(404).json({ error: "Place not found" });
        return;
      }
      res.json(place);
    } catch (error) {
      console.error("Error in getPlace:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getNearbyPlaces(req: Request, res: Response): Promise<void> {
    try {
      const latitude = Number(req.query.latitude);
      const longitude = Number(req.query.longitude);
      const radius = Number(req.query.radius);
      if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
        res
          .status(400)
          .json({
            error:
              "Missing or invalid query parameters: latitude, longitude, radius",
          });
        return;
      }
      const places = await this.placeService.getNearbyPlaces({
        latitude,
        longitude,
        radius,
      });
      res.json(places);
    } catch (error) {
      console.error("Error in getNearbyPlaces:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRoute(req: Request, res: Response): Promise<void> {
    try {
      const start = Number(req.query.start);
      const end = Number(req.query.end);
      if (isNaN(start) || isNaN(end)) {
        res
          .status(400)
          .json({ error: "Missing or invalid query parameters: start, end" });
        return;
      }
      const routeResult = await this.placeService.getRoute(start, end);
      if (!routeResult) {
        res.status(404).json({ error: "Start or end place not found" });
        return;
      }
      res.json(routeResult);
    } catch (error) {
      console.error("Error in getRoute:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
