import { getVoteHistory, removeVoteHistory, saveVoteHistory } from "@lib/db";

export const handleVoteHistory = async (
  messageId: string,
  voter: string,
  selectedAnswer: number,
  groupId: string,
  isAnswerValid: boolean
): Promise<{ hasPassedBefore: boolean }> => {
  const voteHistory = await getVoteHistory(messageId, voter);

  const hasPassedBefore = voteHistory.some((res: any) => res.is_passed);

  // Remove existing vote history if it exists
  if (voteHistory.length > 0) {
    await removeVoteHistory(messageId, voter);
  }

  return { hasPassedBefore };
};
