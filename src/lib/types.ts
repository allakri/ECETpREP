
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
}

export type AnswerSheet = {
  [questionId: number]: string;
};

export type MarkedQuestions = number[];
