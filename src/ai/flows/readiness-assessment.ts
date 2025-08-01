
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
  readiness: z.string().describe('A paragraph assessing if the student is ready for the real exam, providing encouragement and specific advice based on their score and weak topics. Use Markdown for formatting.'),
});
export type ReadinessAssessmentOutput = z.infer<typeof ReadinessAssessmentOutputSchema>;

export async function assessReadiness(input: ReadinessAssessmentInput): Promise<ReadinessAssessmentOutput> {
  return readinessAssessmentFlow(input);
}

const readinessAssessmentPrompt = ai.definePrompt({
  name: 'readinessAssessmentPrompt',
  input: {schema: ReadinessAssessmentInputSchema},
  output: {schema: ReadinessAssessmentOutputSchema},
  prompt: `You are an experienced and encouraging AI guidance counselor. Your task is to provide a realistic but motivational readiness assessment for a student who just completed a practice exam.

**Student's Performance Data:**
- Exam Name: {{{examName}}}
- Score: {{{score}}}%
- Topics with incorrect answers: {{#if incorrectTopics}}{{#each incorrectTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None!{{/if}}

**Your Assessment MUST Follow This Structure:**

1.  **Readiness Level:** Start by giving a clear, one-sentence assessment of their current readiness. Use one of these phrases:
    *   **Score > 85%:** "You are well-prepared and on track for success."
    *   **Score 60-84%:** "You have a strong foundation, but a few key areas need more focus."
    *   **Score < 60%:** "You've built a starting point, and with a focused strategy, you can make significant improvements."

2.  **Strengths:** Briefly mention what their score indicates as a strength.
    *   If score is high, praise their solid understanding.
    *   If score is mid-range, acknowledge their grasp of core concepts.
    *   If score is low, praise their effort in attempting the test.

3.  **Areas for Improvement:**
    *   Clearly list the topics where they made mistakes: {{#if incorrectTopics}}"Your main areas for improvement are: {{#each incorrectTopics}}**{{{this}}}**{{#unless @last}}, {{/unless}}{{/each}}."{{else}}"You had no incorrect topics, which is outstanding! Focus on revision and time management."{{/if}}

4.  **Actionable Next Step:** Provide ONE clear, immediate next step.
    *   Example: "Your next step should be to review the incorrect answers from this test using the 'Review Answers' feature. Pay close attention to the explanations for the '{{{incorrectTopics.[0]}}}' questions."
    *   If there are no incorrect topics, suggest: "Your next step is to take another mock test under timed conditions to improve speed and consistency."

Keep the entire response to a single, concise paragraph. Be motivational and encouraging.
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
