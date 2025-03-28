import { readFromCache, writeToCache } from "@config/cache";
import { GROUP_IDs } from "@config/IDs";
import { waClient } from "@config/wa";
import { AirtableAdapter, QuizService, StorageAdapter } from "@lib/quiz";
import { Poll } from "whatsapp-web.js";
import { preparePollAnswer } from "../utils/preparePollAnswer";
import { sendMessageToGroups } from "../utils/sendMessageToGroups";
import { sendPollToGroups } from "../utils/sendPollToGroups";
import { saveAnswer } from "@lib/db";

export const onReady = async () => {
  const airtableAdapter = new AirtableAdapter();
  const storageAdapter = new StorageAdapter(airtableAdapter);
  const quizService = new QuizService(storageAdapter);

  const { current, past } = await quizService.getQuizData();

  if (past && past?.Question) {
    const message = preparePollAnswer(
      past.Options[past.Answer],
      past.Explanation,
      past.Resource
    );

    await sendMessageToGroups(GROUP_IDs, message);
  }

  await sendPollToGroups(GROUP_IDs, current);

  await quizService.markAsComplete(current.ID);
};
