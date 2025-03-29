import { StorageAdapter } from "./adapters/storage";

export class QuizService {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  async getQuizData() {
    return this.storage.fetchQuizData();
  }

  async markAsComplete(id: string) {
    this.storage.updateStatus(id, "Done");
  }
}
