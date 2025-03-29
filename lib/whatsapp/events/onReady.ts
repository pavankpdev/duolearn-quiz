import {
  DailyScheduleCronExpression,
  WeeklyScheduleCronExpression,
} from "@config/constants";
import { AirtableAdapter, QuizService, StorageAdapter } from "@lib/quiz";
import { scheduleJob } from "@helpers/scheduleJob";
import { sendDailyQuiz } from "../utils/sendDailyQuiz";
import { sendLeaderboard } from "../utils/sendLeaderboard";

export const onReady = () => {
  const airtableAdapter = new AirtableAdapter();
  const storageAdapter = new StorageAdapter(airtableAdapter);
  const quizService = new QuizService(storageAdapter);

  scheduleJob(DailyScheduleCronExpression, () => sendDailyQuiz(quizService));
  scheduleJob(WeeklyScheduleCronExpression, () => sendLeaderboard());
};
