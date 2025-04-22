# GiggleMap Backend Prototype

This repository contains the prototype backend for the GiggleMap Foundation’s open‑source mapping service. It is built in TypeScript using Domain‑Driven Design (DDD), SOLID principles, and dependency injection (tsyringe). The service provides place data storage, geolocation queries, basic route calculations, and is designed for performance, scalability, and observability.

## Table of Contents
- [GiggleMap Backend Prototype](#gigglemap-backend-prototype)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack \& Architecture](#tech-stack--architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Database Setup](#database-setup)
    - [Build \& Run](#build--run)
    - [Development Mode](#development-mode)
    - [Testing](#testing)
  - [API Endpoints](#api-endpoints)
  - [Bonus Scope](#bonus-scope)
    - [1. Further Performance Improvement](#1-further-performance-improvement)
    - [2. Worldwide Availability](#2-worldwide-availability)
    - [3. End-to-End Provision](#3-end-to-end-provision)
    - [4. Security](#4-security)

---

## Features
- **Place Management**: Create, retrieve, and query places with name, description, category, and geographic location.
- **Geolocation Queries**: Find all places within a radius of a given latitude/longitude.
- **Basic Route Calculation**: Compute straight‑line distance (Haversine formula) between two places.
- **Health & Metrics**: `/api/health` and `/api/metrics` endpoints for observability.
- **Authentication**: Token‑based middleware to protect write and query endpoints.
- **Automated Tests**: Jest + Supertest integration tests covering all core flows.

## Tech Stack & Architecture
- **Language**: TypeScript
- **Web Framework**: Express
- **Dependency Injection**: tsyringe
- **Database**: PostgreSQL + PostGIS
- **Testing**: Jest, ts‑jest, Supertest
- **Design**: Domain‑Driven Design (DDD), SOLID principles, layered architecture

```
src/
├── config/             # DI container setup
├── domain/             # Entities and repository interfaces
├── storage/     # Database pool and repository implementations
├── controllers/       # Express controllers & routes
├── /middleware/         # Authentication, logging, metrics
└── index.ts            # App entrypoint
tests/                  # Integration tests
migrations.sql          # Database schema & PostGIS setup
README.md               # This documentation
```

## Getting Started

### Prerequisites
- Node.js v16+ and npm (or Yarn)
- PostgreSQL with PostGIS extension
- Git

### Installation
```bash
git clone <your-repo-url>
cd gigglemap-backend
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```dotenv
DATABASE_URL=postgresql://<db_user>:<db_pass>@localhost:5432/gigglemap
AUTH_TOKEN=testtoken
PORT=3000
```

### Database Setup
1. **Create database:**
   ```bash
   psql -d postgres -c "CREATE DATABASE gigglemap;"
   ```
2. **Enable PostGIS & run migrations:**
   ```bash
   psql -d gigglemap -f migrations.sql
   ```

### Build & Run
```bash
npm run build
npm start
```
The API will be available at `http://localhost:3000/api/`.

### Development Mode
```bash
npm run dev
```  
Runs directly with `ts-node` and hot reload via restarting.

### Testing
```bash
npm test
```
Runs the Jest integration suite against a live in‑memory app.

## API Endpoints
- `GET /api/health` → Health check
- `GET /api/metrics` → JSON runtime metrics
- `POST /api/places` → Create a new place (protected)
- `GET /api/places/:id` → Retrieve a place by ID (protected)
- `GET /api/places/nearby?latitude=&longitude=&radius=` → Nearby search (protected)
- `GET /api/route?start=&end=` → Calculate route distance (protected)

_Protected endpoints require header `Authorization: Bearer <AUTH_TOKEN>`._

## Bonus Scope

### 1. Further Performance Improvement
- **Spatial Sharding & Partitioning**: Partition the `places` table by geographic region (e.g., country or grid tile) to reduce index size per region and improve query locality.
- **Caching Hotspots**: Use Redis or a CDN edge cache for popular queries (e.g., frequently searched areas) to serve results without hitting the database.
- **Precomputed Tiles/Indices**: Maintain precomputed hex‑bin or quad‑tree summaries at various zoom levels for super‑fast aggregate queries.
- **Autoscaling & Read Replicas**: Deploy the database with horizontal read replicas, using a read‑write splitting proxy (e.g., Pgpool) and auto‑scale replicas based on query load.
- **Adaptive Rate Limiting**: Apply dynamic, usage‑pattern aware rate limiting to throttle abusive or heavy queries in high‑traffic zones.
- **Load Testing & Tuning**: Continuously benchmark key endpoints (especially `/places/nearby`) with tools like k6, and tune PostGIS GIST index parameters, PostgreSQL planner settings, and caching strategies.

### 2. Worldwide Availability
- **Multi‑Region Deployments**: Deploy the application stack (App + DB replicas) in multiple cloud regions (AWS/GCP/Azure) close to major user populations.
- **Global Traffic Routing**: Use a global load balancer (e.g., AWS Global Accelerator, Cloudflare) to route users to their nearest region for minimal latency.
- **Geo‑Replicated Data Store**: Use asynchronous data replication across regions, with conflict‑free merge strategies or read‑only fallback in remote regions.
- **Edge Compute with Functions**: For read‑heavy queries, deploy serverless edge functions (e.g., Cloudflare Workers, AWS Lambda@Edge) to serve cached or precomputed results.

### 3. End-to-End Provision
- **Infrastructure as Code**: Write Terraform/CloudFormation modules to provision networks, databases, caches, and compute resources.
- **CI/CD Pipeline**: Automate build, test, containerization, and deployment using GitHub Actions/GitLab CI. On merge to `main`, build Docker images, push to registry, and deploy via Helm or Terraform.
- **Docker Compose for Local Dev**: Provide a `docker-compose.yml` that spins up Postgres+PostGIS and the backend for local development and testing.
- **Health Checks & Rollbacks**: Configure Kubernetes liveness/readiness probes and automated rollbacks on failed deploys.

### 4. Security
- **Authentication & Authorization**: Upgrade from static token to JWT with scopes/roles or OAuth 2.0 with an identity provider (e.g., Auth0, AWS Cognito).
- **Transport & Data Encryption**: Enforce HTTPS/TLS for all client‑server communications and at‑rest/database encryption.
- **Input Validation**: Sanitize and validate all inputs using a library like `Joi` or `zod` to prevent injection attacks.
- **Rate Limiting & Throttling**: Use express-rate-limit or API gateway policies to protect against DDoS and abuse.
- **Logging & Monitoring**: Centralize logs (JSON format) to a SIEM (e.g., Splunk, ELK) and set alerts on suspicious activity patterns.
- **Dependency Scanning**: Integrate SCA tools (e.g., Dependabot, Snyk) to catch vulnerable dependencies.
- **Secrets Management**: Store credentials in a secure vault (AWS Secrets Manager, HashiCorp Vault) instead of plain `.env` files.

