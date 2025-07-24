import type { Question } from '@/lib/types';

export const questions: Question[] = [
  {
    id: 1,
    question: "In a series RLC circuit, what is the condition for resonance?",
    options: ["XL > XC", "XL < XC", "XL = XC", "R = 0"],
    correctAnswer: "XL = XC",
    topic: "Electrical Circuits"
  },
  {
    id: 2,
    question: "Which of the following is a non-volatile memory?",
    options: ["DRAM", "SRAM", "ROM", "Cache Memory"],
    correctAnswer: "ROM",
    topic: "Computer Architecture"
  },
  {
    id: 3,
    question: "The rate of change of momentum is directly proportional to the:",
    options: ["Applied Force", "Velocity", "Mass", "Acceleration"],
    correctAnswer: "Applied Force",
    topic: "Physics"
  },
  {
    id: 4,
    question: "What is the integral of 1/x dx?",
    options: ["x^2", "ln|x| + C", "1/x^2", "e^x"],
    correctAnswer: "ln|x| + C",
    topic: "Mathematics"
  },
  {
    id: 5,
    question: "Which data structure uses the Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack",
    topic: "Data Structures"
  },
  {
    id: 6,
    question: "The pH of a neutral solution is:",
    options: ["0", "7", "14", "1"],
    correctAnswer: "7",
    topic: "Chemistry"
  },
  {
    id: 7,
    question: "What is the primary function of a transformer?",
    options: ["Convert AC to DC", "Convert DC to AC", "Step up or step down voltage", "Store electrical energy"],
    correctAnswer: "Step up or step down voltage",
    topic: "Electrical Machines"
  },
  {
    id: 8,
    question: "In C programming, what does 'malloc()' function do?",
    options: ["Frees memory", "Allocates memory", "Creates a file", "Closes a file"],
    correctAnswer: "Allocates memory",
    topic: "Programming"
  },
   {
    id: 9,
    question: "What is the primary purpose of an operating system?",
    options: ["To provide a user interface", "To manage hardware and software resources", "To run applications", "To connect to the internet"],
    correctAnswer: "To manage hardware and software resources",
    topic: "Operating Systems"
  },
  {
    id: 10,
    question: "In networking, what does the acronym LAN stand for?",
    options: ["Large Area Network", "Local Access Network", "Local Area Network", "Long Area Network"],
    correctAnswer: "Local Area Network",
    topic": "Networking"
  }
];

