"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.PlaceRepository = void 0;
const tsyringe_1 = require("tsyringe");
const place_1 = require("../domain/models/place");
const DataBase_1 = require("../storage/DataBase");
let PlaceRepository = class PlaceRepository {
    create(place) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = DataBase_1.Database.getPool();
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
            const result = yield pool.query(sql, values);
            const row = result.rows[0];
            return new place_1.Place({
                id: row.id,
                name: row.name,
                description: row.description,
                category: row.category,
                latitude: row.latitude,
                longitude: row.longitude,
                createdAt: row.created_at,
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = DataBase_1.Database.getPool();
            const sql = `
      SELECT id, name, description, category, created_at,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE id = $1
    `;
            const result = yield pool.query(sql, [id]);
            if (result.rowCount === 0)
                return null;
            const row = result.rows[0];
            return new place_1.Place({
                id: row.id,
                name: row.name,
                description: row.description,
                category: row.category,
                latitude: row.latitude,
                longitude: row.longitude,
                createdAt: row.created_at,
            });
        });
    }
    findNearby(latitude, longitude, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = DataBase_1.Database.getPool();
            const sql = `
      SELECT id, name, description, category, created_at,
             ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2),4326)) as distance,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2),4326), $3)
      ORDER BY distance ASC
    `;
            const result = yield pool.query(sql, [longitude, latitude, radius]);
            return result.rows.map((row) => (Object.assign(Object.assign({}, new place_1.Place({
                id: row.id,
                name: row.name,
                description: row.description,
                category: row.category,
                latitude: row.latitude,
                longitude: row.longitude,
                createdAt: row.created_at,
            })), { distance: row.distance })));
        });
    }
    findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = DataBase_1.Database.getPool();
            const sql = `
      SELECT id, name, description, category, created_at,
             ST_X(location::geometry) as longitude,
             ST_Y(location::geometry) as latitude
      FROM places
      WHERE id = ANY($1::int[])
    `;
            const result = yield pool.query(sql, [ids]);
            return result.rows.map((row) => new place_1.Place({
                id: row.id,
                name: row.name,
                description: row.description,
                category: row.category,
                latitude: row.latitude,
                longitude: row.longitude,
                createdAt: row.created_at,
            }));
        });
    }
};
exports.PlaceRepository = PlaceRepository;
exports.PlaceRepository = PlaceRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PlaceRepository);
