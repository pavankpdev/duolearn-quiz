import { pgPool } from "@config/pg";

/**
 * Executes a series of SQL queries within a transaction.
 *
 * @param queries - An array of objects containing the SQL query and its parameters.
 * @returns A promise that resolves when the transaction is successfully committed.
 * @throws An error if any query fails or the transaction cannot be committed.
 */
export const executeTransaction = async (
  queries: { query: string; params?: any[] }[]
): Promise<void> => {
  const client = await pgPool.connect();
  try {
    await client.query("BEGIN");

    for (const { query, params } of queries) {
      await client.query(query, params || []);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error executing transaction:", error);
    throw error;
  } finally {
    client.release();
  }
};
