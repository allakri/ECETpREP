
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

export interface AppUser {
    uid: string;
    name: string;
    email: string;
    phoneNumber: string;
    branch: string;
    college: string;
    yearOfStudy: string;
    createdAt: any;
    updatedAt?: any;
}
