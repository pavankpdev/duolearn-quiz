import { Pool } from "pg";
import { DATABASE_URL } from "../config/constants";

export const pgPool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
