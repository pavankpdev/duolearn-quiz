import { pgPool } from "@config/pg";
import { executeQuery } from "../utils/executeQuery";
import { executeTransaction } from "../utils/executeTransaction";

export const incrementLeaderBoardPoint = async (
  candidateId: string,
  groupId: string
): Promise<void> => {
  const queries = [
    {
      query: `SELECT points FROM "leaderboard" WHERE candidate_id = $1 AND group_id = $2`,
      params: [candidateId, groupId],
    },
    {
      query: `
          INSERT INTO "leaderboard" (candidate_id, group_id, points)
          VALUES ($1, $2, 1)
          ON CONFLICT (candidate_id, group_id)
          DO UPDATE SET points = "leaderboard".points + 1
        `,
      params: [candidateId, groupId],
    },
  ];

  await executeTransaction(queries);
};

export const decrementLeaderBoardPoint = async (
  candidateId: string,
  groupId: string
): Promise<void> => {
  const queries = [
    {
      query: `SELECT points FROM "leaderboard" WHERE candidate_id = $1 AND group_id = $2`,
      params: [candidateId, groupId],
    },
    {
      query: `
          UPDATE "leaderboard"
          SET points = CASE
            WHEN points > 0 THEN points - 1
            ELSE points
          END
          WHERE candidate_id = $1 AND group_id = $2
        `,
      params: [candidateId, groupId],
    },
  ];

  await executeTransaction(queries);
};

export const getCurrentLeaderBoard = async (groupId: string) => {
  const query = `
  SELECT candidate_id, points
  FROM "leaderboard"
  WHERE group_id = $1
  ORDER BY points DESC
  LIMIT 5;
`;

  const values = [groupId];
  return executeQuery<any>(query, values);
};
