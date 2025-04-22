-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create a table for storing places
CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  location geography(Point, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create a spatial index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST(location);
