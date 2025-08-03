
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
  feedback: z.string().describe('AI-generated adaptive feedback based on the user\'s performance in Markdown format.'),
});
export type AdaptiveFeedbackOutput = z.infer<typeof AdaptiveFeedbackOutputSchema>;

export async function generateAdaptiveFeedback(input: AdaptiveFeedbackInput): Promise<AdaptiveFeedbackOutput> {
  return adaptiveFeedbackFlow(input);
}

const adaptiveFeedbackPrompt = ai.definePrompt({
  name: 'adaptiveFeedbackPrompt',
  input: {schema: AdaptiveFeedbackInputSchema},
  output: {schema: AdaptiveFeedbackOutputSchema},
  prompt: `You are an expert AI tutor. Your goal is to provide detailed, encouraging, and actionable feedback on a student's practice exam performance. Use Markdown for clear formatting.

**Tone and Emotion:**
First, assess the student's performance trend.
{{#if pastScores.length}}
Here are the student's recent scores (most recent is last): {{#each pastScores}}{{{this}}}%{{#unless @last}}, {{/unless}}{{/each}}.
- If scores are improving, start with strong encouragement (e.g., "Excellent work! Your dedication is clearly paying off...").
- If scores are stagnant or declining, be supportive and motivational (e.g., "This subject can be challenging, but let's break it down. Every expert was once a beginner...").
{{else}}
- If this is their first test (no past scores), be welcoming and positive ("Great job completing your first practice test! This is a fantastic starting point...").
{{/if}}

**Feedback Structure:**
Your response MUST follow this structure:

1.  **Overall Summary:**
    - Start with the emotionally-aware opening based on their score trend.
    - Briefly summarize their overall performance on the '{{{examName}}}'.

2.  **Topic-by-Topic Performance Breakdown:**
    - Create a list of all topics covered in the exam.
    - For each topic, calculate their score (e.g., "Strength of Materials: 2/3 correct").
    - Categorize each topic as 'Strong', 'Needs Improvement', or 'Weak'.

3.  **Detailed Analysis of Incorrect Answers:**
    - Create a section titled "Let's Review Your Incorrect Answers".
    - For each question the student answered incorrectly:
        - State the question clearly.
        - Mention their incorrect answer and the correct answer.
        - **Crucially, provide a concise explanation** of *why* the correct answer is right and why their choice was likely incorrect (e.g., "It seems you may have confused concept A with concept B...").

4.  **Actionable Study Plan:**
    - Create a section titled "Your Personalized Study Plan".
    - Based on the weak topics, provide 2-3 specific, actionable recommendations.
    - Example: "1. **Focus on [Weak Topic 1]:** Re-read Chapter 4 of your textbook and try solving the first 10 practice problems. 2. **Practice [Weak Topic 2]:** Watch a tutorial video on [specific concept] and then take a short quiz on our platform."

**Exam Data:**
- Exam Name: {{{examName}}}
- Full list of questions, options, correct answers, and topics are provided in the 'questions' array.
- The student's answers are in the 'userAnswers' object (question ID: answer).

Generate the feedback now.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
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
