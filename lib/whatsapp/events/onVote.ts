import {
  getAnswerByMessageId,
  getVoteHistory,
  removeVoteHistory,
  saveVoteHistory,
} from "@lib/db";
import {
  decrementLeaderBoardPoint,
  incrementLeaderBoardPoint,
} from "@lib/db/queries/leaderboard";
import { PollVote } from "whatsapp-web.js";
import { handleVoteHistory } from "../utils/handleVoteHistory";
import { validateAnswer } from "../utils/validateAnswer";
import { updateLeaderboard } from "../utils/updateLeaderboard";

export const onVote = async (vote: PollVote) => {
  const { voter } = vote;
  const selectedAnswer =
    vote.selectedOptions.length === 1
      ? (vote.selectedOptions as unknown as [{ localId: number }])[0].localId
      : null;
  const messageId = vote.parentMessage.id._serialized;
  const groupId = vote.parentMessage.to;

  // If no answer is selected, handle vote removal and return early
  if (selectedAnswer === null) {
    const voteHistory = await getVoteHistory(messageId, voter);
    if (voteHistory.some((res: any) => res.is_passed)) {
      await decrementLeaderBoardPoint(voter, groupId);
    }
    await removeVoteHistory(messageId, voter);
    return;
  }

  const isAnswerValid = await validateAnswer(messageId, selectedAnswer);

  const { hasPassedBefore } = await handleVoteHistory(
    messageId,
    voter,
    selectedAnswer,
    groupId,
    isAnswerValid
  );

  await updateLeaderboard(voter, groupId, isAnswerValid, hasPassedBefore);

  await saveVoteHistory(
    messageId,
    voter,
    selectedAnswer,
    groupId,
    isAnswerValid
  );
};
