import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connectionUri = process.env.DATABASE_URL!;

// Use global to store the connection to prevent multiple connections in dev
const globalForDb = global as unknown as { 
  db: any;
  pool: mysql.Pool | undefined;
};

if (!globalForDb.pool) {
  globalForDb.pool = mysql.createPool({
    uri: connectionUri,
    connectionLimit: 10,
  });
}

export const db = globalForDb.db ?? drizzle(globalForDb.pool, { schema, mode: "default" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
