import { GROUP_IDs, MODE } from "@config/constants";
import { waClient } from "@config/wa";
import { getCurrentLeaderBoard } from "@lib/db/queries/leaderboard";

export const sendLeaderboard = async () => {
  for (const group of GROUP_IDs) {
    const leaderBoard = await getCurrentLeaderBoard(group);

    const placeEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

    const leaderboardMessage = `
🏆 *Duolearn Leaderboard Update!* 🏆\n
The top performers of the week.
Let’s give a huge round of applause! 👏

${leaderBoard
  .map((leader: any, index: number) => {
    return `${placeEmojis[index]} *${index + 1}st Place:*
${leader.candidate_id} - ${leader.points} points`;
  })
  .join("\n")}

Keep answering quizzes every day to earn more points and Duolearn rewards in the future! 🌟

Stay motivated and keep learning! 🚀📚
       `;

    if (MODE === "dev") {
      await waClient.sendMessage(group, leaderboardMessage);
    } else {
      await waClient.sendMessage(group, leaderboardMessage, {
        mentions: leaderBoard.map((leader: any) => leader?.candidate_id),
      });
    }
  }
};
