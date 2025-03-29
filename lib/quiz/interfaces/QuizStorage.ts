import { QuizData } from "../types";

export interface IQuizStorage {
  fetchQuizData(): Promise<QuizData>;
  updateStatus(id: string, status: string): Promise<void>;
}
