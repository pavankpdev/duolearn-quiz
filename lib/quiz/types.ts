export interface QuizItem {
  Question: string;
  Options: string[];
  Answer: number;
  Explanation: string;
  Resource: string;
  Status: "Scheduled" | "Done";
  ID: string;
  Created: string;
  LastModified: string;
}

export interface QuizData {
  current: QuizItem;
  past?: QuizItem | null;
}
