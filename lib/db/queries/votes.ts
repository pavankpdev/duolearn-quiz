import { executeQuery } from "../utils/executeQuery";

export const getVoteHistory = async (messageId: string, voter_id: string) => {
  const query = `SELECT * FROM "vote_history" WHERE message_id = $1 AND voter_id = $2`;
  return executeQuery<any>(query, [messageId, voter_id]);
};

export const removeVoteHistory = async (
  messageId: string,
  voter_id: string
) => {
  const query = `DELETE FROM "vote_history" WHERE message_id = $1 AND voter_id = $2`;
  const values = [messageId, voter_id];

  return executeQuery<any>(query, values);
};

export const saveVoteHistory = async (
  messageId: string,
  voterId: string,
  option: number,
  groupId: string,
  isPassed: boolean
) => {
  const query = `
    INSERT INTO "vote_history" (message_id, voter_id, option, group_id, is_passed)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [messageId, voterId, option, groupId, isPassed];
  return executeQuery<any>(query, values);
};
