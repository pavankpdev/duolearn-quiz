import { executeQuery } from "../utils/executeQuery";

export const saveAnswer = async (
  messageId: string,
  answer: number,
  groupId: string
): Promise<void> => {
  const query = `INSERT INTO "answers" (message_id, answer, group_id) VALUES ($1, $2, $3)`;
  await executeQuery(query, [messageId, answer, groupId]);
};

export const getAnswerByMessageId = async (messageId: string): Promise<any> => {
  const query = `SELECT * FROM "answers" WHERE message_id = $1`;
  return executeQuery(query, [messageId]);
};
