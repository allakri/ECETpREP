
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

export interface RegisterFormValues {
  name: string;
  email: string;
  password?: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  createdAt: Date;
}
