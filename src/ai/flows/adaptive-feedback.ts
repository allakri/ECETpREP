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

const AdaptiveFeedbackInputSchema = z.object({
  examName: z.string().describe('The name of the exam the user took.'),
  userAnswers: z.record(z.string(), z.string()).describe('A map of question IDs to the user\'s answers.'),
  correctAnswers: z.record(z.string(), z.string()).describe('A map of question IDs to the correct answers.'),
  topics: z.record(z.string(), z.string()).describe('A map of question IDs to the topics the questions cover.'),
  pastScores: z.array(z.number()).optional().describe("An array of the user's past scores (as percentages) on previous tests."),
});
export type AdaptiveFeedbackInput = z.infer<typeof AdaptiveFeedbackInputSchema>;

const AdaptiveFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-generated adaptive feedback based on the user\'s performance.'),
});
export type AdaptiveFeedbackOutput = z.infer<typeof AdaptiveFeedbackOutputSchema>;

export async function generateAdaptiveFeedback(input: AdaptiveFeedbackInput): Promise<AdaptiveFeedbackOutput> {
  return adaptiveFeedbackFlow(input);
}

const adaptiveFeedbackPrompt = ai.definePrompt({
  name: 'adaptiveFeedbackPrompt',
  input: {schema: AdaptiveFeedbackInputSchema},
  output: {schema: AdaptiveFeedbackOutputSchema},
  prompt: `You are an AI-powered tutoring system that provides personalized, emotion-aware feedback to students based on their performance on practice exams.

Your task is to identify the student's weak areas and provide suggestions for improvement. Focus on actionable advice and specific topics to study.

Crucially, you must adjust your tone based on the student's performance history.
{{#if pastScores}}
Here are the student's recent scores: {{#each pastScores}}{{{this}}}%{{#unless @last}}, {{/unless}}{{/each}}.
- If you see a trend of improvement, be very encouraging! For example: "Great progress! You've clearly been working hard and it's paying off."
- If the scores are stagnant or declining, be supportive and motivational, not critical. For example: "This subject can be tricky, but don't get discouraged. Let's pinpoint where we can focus to get you back on track."
- If this is their first test, be welcoming and set a positive tone.
{{/if}}

Exam Name: {{{examName}}}

Student Answers:
{{#each userAnswers}}
  Question ID: {{@key}}, Answer: {{{this}}}
{{/each}}

Correct Answers:
{{#each correctAnswers}}
  Question ID: {{{@key}}}, Answer: {{{this}}}
{{/each}}

Topics:
{{#each topics}}
  Question ID: {{{@key}}}, Topic: {{{this}}}
{{/each}}

Provide detailed, tailored feedback to the student with an appropriate, supportive, and adaptive tone.
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
