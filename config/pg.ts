import { Client, Pool } from "pg";
import { DATABASE_URL } from "../config/constants";

export const pgClient = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_z2G3otfUHqkX@ep-old-star-a11ru1n8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

export const pgPool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
