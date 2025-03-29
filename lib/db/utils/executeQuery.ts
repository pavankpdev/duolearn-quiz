import { pgPool } from "@config/pg";
/**
 * Executes a SQL query using the provided connection pool.
 *
 * @param query - The SQL query to execute.
 * @param params - An array of parameters to be passed to the query.
 * @returns A promise that resolves to the result of the query.
 */

export const executeQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T> => {
  const client = await pgPool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows as T;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    client.release();
  }
};
