
'use server';

/**
 * @fileOverview AI-powered adaptive feedback for practice exams.
 *
 * - generateAdaptiveFeedback - A function that generates adaptive feedback based on the user's performance.
 * - AdaptiveFeedbackInput - The input type for the generateAdaptiveFeedback function.
 * - AdaptiveFeedbackOutput - The return type for the generateAdaptiveFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  topic: z.string(),
});

const AdaptiveFeedbackInputSchema = z.object({
  examName: z.string().describe('The name of the exam the user took.'),
  questions: z.array(QuestionSchema).describe('The full list of questions from the exam.'),
  userAnswers: z.record(z.string(), z.string()).describe('A map of question IDs to the user\'s answers.'),
  pastScores: z.array(z.number()).optional().describe("An array of the user's past scores (as percentages) on previous tests, including the current one."),
});
export type AdaptiveFeedbackInput = z.infer<typeof AdaptiveFeedbackInputSchema>;

const AdaptiveFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-generated adaptive feedback based on the user\'s performance in Markdown format. The entire response must be under 200 words.'),
});
export type AdaptiveFeedbackOutput = z.infer<typeof AdaptiveFeedbackOutputSchema>;

export async function generateAdaptiveFeedback(input: AdaptiveFeedbackInput): Promise<AdaptiveFeedbackOutput> {
  return adaptiveFeedbackFlow(input);
}

const adaptiveFeedbackPrompt = ai.definePrompt({
  name: 'adaptiveFeedbackPrompt',
  input: {schema: AdaptiveFeedbackInputSchema},
  output: {schema: AdaptiveFeedbackOutputSchema},
  prompt: `You are an AI Tutor. A student just finished the '{{{examName}}}'. Your task is to provide concise, actionable feedback based on their performance.

**IMPORTANT RULES:**
1.  **Total response MUST be under 200 words.**
2.  Use Markdown for formatting (headings, lists).
3.  Be encouraging but direct.

**Analyze the provided exam data:**
-   **Questions**: The full list of questions, including correct answers and topics.
-   **User Answers**: A map of question IDs to the student's selected answers.
-   **Past Scores**: An optional array of previous scores, with the most recent score last. ({{pastScores}})

**Follow this exact structure for your response:**

1.  **Greeting & Overall Performance:**
    - Start with an encouraging sentence. If past scores show improvement, mention it. If not, be motivational.
    - State their overall performance on this exam.

2.  **Strengths:**
    - Create a list titled "**Strengths**".
    - Identify 1-2 topics where the student performed well and list them.

3.  **Top 3 Areas for Improvement:**
    - Create a list titled "**Areas for Improvement**".
    - Identify the top 3 topics where the student made the most mistakes.
    - For each topic, provide ONE specific, actionable suggestion (e.g., "Review concept X," "Practice more problems on topic Y.").

Generate the feedback now.
`,
});

const adaptiveFeedbackFlow = ai.defineFlow(
  {
    name: 'adaptiveFeedbackFlow',
    inputSchema: AdaptiveFeedbackInputSchema,
    outputSchema: AdaptiveFeedbackOutputSchema,
  },
  async input => {
    const {output} = await adaptiveFeedbackPrompt(input);
    return output!;
  }
);
