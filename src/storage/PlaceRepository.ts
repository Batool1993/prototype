import { injectable } from "tsyringe";
import { IPlaceRepository } from "../domain/repos/IPlaceRepo";
import { Place } from "../domain/models/place";
import { Database } from "../storage/DataBase";

@injectable()
export class PlaceRepository implements IPlaceRepository {
  async create(place: Place): Promise<Place> {
    const pool = Database.getPool();
    const sql = `
      INSERT INTO places (name, description, category, location)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5),4326))
      RETURNING id, name, description, category, created_at,
                ST_X(location::geometry) as longitude,
                ST_Y(location::geometry) as latitude
    `;
    const values = [
      place.name,
      place.description,
      place.category,
      place.longitude,
      place.latitude,
    ];
    const result = await pool.query(sql, values);
    const row = result.rows[0];
    return new Place({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      latitude: row.latitude,
      longitude: row.longitude,
      createdAt: row.created_at,
    });
  }

  async findById(id: number): Promise<Place | null> {
    const pool = Database.getPool();
    const sql = `
      SELECT id, name, description, category, created_at,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE id = $1
    `;
    const result = await pool.query(sql, [id]);
    if (result.rowCount === 0) return null;
    const row = result.rows[0];
    return new Place({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      latitude: row.latitude,
      longitude: row.longitude,
      createdAt: row.created_at,
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<(Place & { distance: number })[]> {
    const pool = Database.getPool();
    const sql = `
      SELECT id, name, description, category, created_at,
             ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2),4326)) as distance,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2),4326), $3)
      ORDER BY distance ASC
    `;
    const result = await pool.query(sql, [longitude, latitude, radius]);
    return result.rows.map((row: any) => ({
      ...new Place({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        latitude: row.latitude,
        longitude: row.longitude,
        createdAt: row.created_at,
      }),
      distance: row.distance,
    }));
  }

  async findByIds(ids: number[]): Promise<Place[]> {
    const pool = Database.getPool();
    const sql = `
      SELECT id, name, description, category, created_at,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE id = ANY($1::int[])
    `;
    const result = await pool.query(sql, [ids]);
    return result.rows.map(
      (row: any) =>
        new Place({
          id: row.id,
          name: row.name,
          description: row.description,
          category: row.category,
          latitude: row.latitude,
          longitude: row.longitude,
          createdAt: row.created_at,
        })
    );
  }
}
