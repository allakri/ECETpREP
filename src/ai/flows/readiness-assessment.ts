'use server';

/**
 * @fileOverview AI-powered exam readiness assessment.
 *
 * - assessReadiness - A function that assesses if a student is ready for the exam.
 * - ReadinessAssessmentInput - The input type for the assessReadiness function.
 * - ReadinessAssessmentOutput - The return type for the assessReadiness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReadinessAssessmentInputSchema = z.object({
  examName: z.string().describe('The name of the exam the user took.'),
  score: z.number().describe('The user\'s score as a percentage.'),
  incorrectTopics: z.array(z.string()).describe('A list of topics where the user answered incorrectly.'),
});
export type ReadinessAssessmentInput = z.infer<typeof ReadinessAssessmentInputSchema>;

const ReadinessAssessmentOutputSchema = z.object({
  readiness: z.string().describe('A paragraph assessing if the student is ready for the real exam, providing encouragement and specific advice based on their score and weak topics.'),
});
export type ReadinessAssessmentOutput = z.infer<typeof ReadinessAssessmentOutputSchema>;

export async function assessReadiness(input: ReadinessAssessmentInput): Promise<ReadinessAssessmentOutput> {
  return readinessAssessmentFlow(input);
}

const readinessAssessmentPrompt = ai.definePrompt({
  name: 'readinessAssessmentPrompt',
  input: {schema: ReadinessAssessmentInputSchema},
  output: {schema: ReadinessAssessmentOutputSchema},
  prompt: `You are an AI-powered guidance counselor for students preparing for competitive exams.
Your task is to provide an honest but encouraging assessment of a student's readiness for their upcoming exam based on their practice test performance.

Analyze the student's score and the topics they struggled with.
Based on this, tell them whether you think they are ready for the real exam. Be realistic but motivational.
If they are not ready, highlight the weak areas and suggest a constructive path forward. If they are doing well, reinforce their confidence.

Exam Name: {{{examName}}}
Score: {{{score}}}%

Topics with incorrect answers:
{{#if incorrectTopics}}
  {{#each incorrectTopics}}
    - {{{this}}}
  {{/each}}
{{else}}
  None! Great job!
{{/if}}

Provide a concise, one-paragraph assessment of their readiness.
`,
  config: {
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

const readinessAssessmentFlow = ai.defineFlow(
  {
    name: 'readinessAssessmentFlow',
    inputSchema: ReadinessAssessmentInputSchema,
    outputSchema: ReadinessAssessmentOutputSchema,
  },
  async input => {
    const {output} = await readinessAssessmentPrompt(input);
    return output!;
  }
);
