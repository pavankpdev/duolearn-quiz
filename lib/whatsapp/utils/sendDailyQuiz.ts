import { GROUP_IDs } from "@config/constants";
import { AirtableAdapter, StorageAdapter, QuizService } from "@lib/quiz";
import { preparePollAnswer } from "./preparePollAnswer";
import { sendMessageToGroups } from "./sendMessageToGroups";
import { sendPollToGroups } from "./sendPollToGroups";

export const sendDailyQuiz = async (qs: QuizService) => {
  try {
    const { current, past } = await qs.getQuizData();

    if (past && past?.Question) {
      const message = preparePollAnswer(
        past.Options[past.Answer],
        past.Explanation,
        past.Resource
      );

      await sendMessageToGroups(GROUP_IDs, message);
    }

    await sendPollToGroups(GROUP_IDs, current);

    await qs.markAsComplete(current.ID);
  } catch (error) {
    console.log(error);
  }
};
