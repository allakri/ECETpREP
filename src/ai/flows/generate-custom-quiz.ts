
'use server';

/**
 * @fileOverview AI-powered custom quiz generator.
 *
 * - generateCustomQuiz - A function that generates a quiz based on user specifications.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  id: z.number().describe("A unique numeric ID for the question."),
  question: z.string().describe("The question text. Should use LaTeX for math, e.g., \\\\frac{1}{2}."),
  options: z.array(z.string()).length(4).describe("An array of exactly four string options. Use LaTeX for math."),
  correctAnswer: z.string().describe("The correct answer, which must be one of the provided options. Use LaTeX for math."),
  topic: z.string().describe("The specific topic this question relates to."),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe("The difficulty level of the question.")
});

const GenerateQuizInputSchema = z.object({
  subjects: z.array(z.string()).describe('An array of one or more subjects to generate questions from.'),
  topics: z.string().optional().describe('Optional comma-separated list of specific topics to focus on within the subjects.'),
  easyQuestions: z.number().int().min(0).describe('Number of easy questions to generate.'),
  mediumQuestions: z.number().int().min(0).describe('Number of medium questions to generate.'),
  hardQuestions: z.number().int().min(0).describe('Number of hard questions to generate.'),
});
type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The array of generated quiz questions.'),
});
type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateCustomQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  // Ensure we don't call the AI with zero questions.
  if (input.easyQuestions + input.mediumQuestions + input.hardQuestions === 0) {
    return { questions: [] };
  }
  return generateCustomQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert Question Paper Generator for ECET-level competitive exams. Your task is to generate a unique, high-quality quiz based on the user's specifications.

You MUST adhere to the following rules:
1.  Generate the exact number of questions for each difficulty level as specified in the input.
2.  All questions should be relevant to the given subjects and, if provided, the specific topics.
3.  All mathematical formulas, variables, and symbols MUST be formatted using LaTeX syntax (e.g., \\\\frac{1}{2}, x^2 should be x^2, \\\\sin(\\theta)). Double backslashes are critical.
4.  Each question must have exactly four options.
5.  The 'correctAnswer' field MUST be an exact match to one of the strings in the 'options' array.
6.  Generate a unique ID for each question.

User's Quiz Specifications:
-   Subjects: {{{subjects}}}
{{#if topics}}-   Specific Topics: {{{topics}}}{{/if}}
-   Number of Easy Questions: {{{easyQuestions}}}
-   Number of Medium Questions: {{{mediumQuestions}}}
-   Number of Hard Questions: {{{hardQuestions}}}

Generate the quiz now.
`,
});

const generateCustomQuizFlow = ai.defineFlow(
  {
    name: 'generateCustomQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
