import { waClient } from "@config/wa";
import { writeToCache } from "@config/cache";
import { QuizItem } from "@lib/quiz/types";
import { Poll } from "whatsapp-web.js";
import { saveAnswer } from "@lib/db";

export const sendPollToGroups = async (
  groupIds: string[],
  currentQuiz: QuizItem
) => {
  for (const gid of groupIds) {
    const message = await waClient.sendMessage(
      gid,
      new Poll(currentQuiz.Question, currentQuiz.Options, {
        allowMultipleAnswers: false,
        messageSecret: [Date.now()],
      })
    );
    console.log("Poll sent to group:", gid, message.id._serialized);

    await writeToCache(gid, message.id._serialized);
    await saveAnswer(message.id._serialized, currentQuiz.Answer, gid);
  }
};
