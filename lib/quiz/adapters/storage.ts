import { IQuizStorage } from "../interfaces/QuizStorage";

export class StorageAdapter {
  private adapter: IQuizStorage;

  constructor(adapter: IQuizStorage) {
    this.adapter = adapter;
  }

  fetchQuizData() {
    return this.adapter.fetchQuizData();
  }

  async updateStatus(id: string, status: string) {
    await this.adapter.updateStatus(id, status);
  }
}
