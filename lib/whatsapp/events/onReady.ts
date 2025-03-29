import { DailyScheduleCronExpression } from "@config/constants";
import { AirtableAdapter, QuizService, StorageAdapter } from "@lib/quiz";
import { scheduleJob } from "@helpers/scheduleJob";
import { sendDailyQuiz } from "../utils/sendDailyQuiz";

export const onReady = () => {
  const airtableAdapter = new AirtableAdapter();
  const storageAdapter = new StorageAdapter(airtableAdapter);
  const quizService = new QuizService(storageAdapter);

  console.log(DailyScheduleCronExpression);

  scheduleJob(DailyScheduleCronExpression, () =>
    sendDailyQuiz(quizService).catch(console.error)
  );
};
