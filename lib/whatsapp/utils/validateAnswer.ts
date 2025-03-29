import { getAnswerByMessageId } from "@lib/db";

export const validateAnswer = async (
  messageId: string,
  selectedAnswer: number
): Promise<boolean> => {
  const answerResult = await getAnswerByMessageId(messageId);
  return answerResult.some(
    (ans: any) => Number(`${ans?.answer}`) === selectedAnswer
  );
};
