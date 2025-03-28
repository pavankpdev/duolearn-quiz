import { Client } from "pg";

export const pgClient = new Client({
  connectionString:
    "postgresql://neondb_owner:npg_z2G3otfUHqkX@ep-old-star-a11ru1n8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});
