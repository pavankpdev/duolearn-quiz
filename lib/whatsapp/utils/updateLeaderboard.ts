import {
  incrementLeaderBoardPoint,
  decrementLeaderBoardPoint,
} from "@lib/db/queries/leaderboard";

export const updateLeaderboard = async (
  voter: string,
  groupId: string,
  isAnswerValid: boolean,
  hasPassedBefore: boolean
): Promise<void> => {
  if (isAnswerValid) {
    // Increment points for a valid answer
    await incrementLeaderBoardPoint(voter, groupId);
  } else {
    // Decrement points if the answer was previously valid
    if (hasPassedBefore) {
      await decrementLeaderBoardPoint(voter, groupId);
    }
  }
};
