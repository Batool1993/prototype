import request from "supertest";
import app from "../src/index";
import { Database } from "../src/storage/DataBase";
import { IPlaceRepository } from '../src/domain/repos/IPlaceRepo';
import { create } from "domain";
import { Place } from "../src/domain/models/place";
import { PlaceService } from "../src/domain/services/PlaceService";

const AUTH_TOKEN = process.env.AUTH_TOKEN || "testtoken";

describe("Places API", () => {
  let createdPlaceId: number;

  it("should create a new place", async () => {
    const newPlace = {
      name: "Test Park",
      description: "A lovely park for testing",
      category: "Park",
      latitude: 37.7749,
      longitude: -122.4194,
    };

    const response = await request(app)
      .post("/api/places")
      .set("Authorization", `Bearer ${AUTH_TOKEN}`)
      .send(newPlace);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    createdPlaceId = response.body.id;
  });

  it("should retrieve the newly created place", async () => {
    const response = await request(app)
      .get(`/api/places/${createdPlaceId}`)
      .set("Authorization", `Bearer ${AUTH_TOKEN}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdPlaceId);
  });

  it("should search for nearby places", async () => {
    const response = await request(app)
      .get("/api/places/nearby")
      .set("Authorization", `Bearer ${AUTH_TOKEN}`)
      .query({
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 5000,
      });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return a stubbed route between two places", async () => {
    const secondPlace = {
      name: "Test Library",
      description: "A testing library",
      category: "Library",
      latitude: 37.78,
      longitude: -122.42,
    };

    const resCreate = await request(app)
      .post("/api/places")
      .set("Authorization", `Bearer ${AUTH_TOKEN}`)
      .send(secondPlace);
    expect(resCreate.status).toBe(201);
    const secondPlaceId = resCreate.body.id;

    const response = await request(app)
      .get("/api/route")
      .set("Authorization", `Bearer ${AUTH_TOKEN}`)
      .query({
        start: createdPlaceId,
        end: secondPlaceId,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("route");
    expect(response.body).toHaveProperty("distanceInMeters");
  });
  afterAll(async () => {
    await Database.getPool().end();
  });
});

describe('tests coordinate storage logic', () => {
  let mockedRepo: jest.Mocked<IPlaceRepository>;
  let service : PlaceService;


  beforeEach(( ) => {
    mockedRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findNearby: jest.fn(),
      findByIds: jest.fn(),

    }

    service = new PlaceService(mockedRepo) ;

  })

  it("checks if the coordinates get stored correctly" , async() => {
     
    const props = {name:'test', descruption :'testing the coordinate logic' ,category:'place' , latitude:3.45 , longitude:4.5 }
    const place = new Place({id:1, ...props})
    const radius = 500;
    let places: (Place & {distance: number })[] = []

    mockedRepo.create.mockResolvedValue(place);
    const result = await service.createPlace(place);
    const params = {name: 'test',latitude: props.latitude , longitude: place.longitude , radius};
    const newPlace = new Place({id:1, ...params})
    let findByResult : (Place & {distance :number} | undefined []) 
    places.push({...newPlace , distance: 0 })
    mockedRepo.findNearby.mockResolvedValue( places);
    const results = await service.getNearbyPlaces(params);
    expect(results).toEqual(places);
  })






})



//latitude : 33.4
//longitude : 44.5
//latitude : 45.4
//longitude : 56.7
//distance : 