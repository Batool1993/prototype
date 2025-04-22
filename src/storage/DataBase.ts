import { Pool } from "pg";

export class Database {
  private static pool: Pool;

  public static getPool(): Pool {
    if (!Database.pool) {
      Database.pool = new Pool({
        connectionString:
          process.env.DATABASE_URL ||
          "postgresql://user:password@localhost:5432/gigglemap",
      });
    }
    return Database.pool;
  }
}