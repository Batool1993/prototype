"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const pg_1 = require("pg");
class Database {
    static getPool() {
        if (!Database.pool) {
            Database.pool = new pg_1.Pool({
                connectionString: process.env.DATABASE_URL ||
                    "postgresql://user:password@localhost:5432/gigglemap",
            });
        }
        return Database.pool;
    }
}
exports.Database = Database;
