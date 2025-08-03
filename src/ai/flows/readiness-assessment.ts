
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
  readiness: z.string().describe('A single paragraph assessing if the student is ready for the real exam, providing encouragement and specific advice based on their score and weak topics. Use Markdown for formatting.'),
});
export type ReadinessAssessmentOutput = z.infer<typeof ReadinessAssessmentOutputSchema>;

export async function assessReadiness(input: ReadinessAssessmentInput): Promise<ReadinessAssessmentOutput> {
  return readinessAssessmentFlow(input);
}

const readinessAssessmentPrompt = ai.definePrompt({
  name: 'readinessAssessmentPrompt',
  input: {schema: ReadinessAssessmentInputSchema},
  output: {schema: ReadinessAssessmentOutputSchema},
  prompt: `You are an encouraging AI guidance counselor. A student just scored **{{{score}}}%** on the '{{{examName}}}'. Their weakest topics were: {{#if incorrectTopics}}{{#each incorrectTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}.

Your task is to generate a single, concise paragraph with a realistic readiness assessment.

**Follow this structure:**

1.  **Start with a readiness statement based on the score:**
    *   Score > 85%: "You are well-prepared and on track for success."
    *   Score 60-84%: "You have a strong foundation, but a few key areas need more focus."
    *   Score < 60%: "You've built a starting point, and with a focused strategy, you can make significant improvements."

2.  **Acknowledge their effort and a key strength.** (e.g., "Your score shows a solid grasp of core concepts.")

3.  **Provide ONE clear, actionable next step.** If there are weak topics, focus on the most important one. If not, suggest a different type of practice.
    *   Example for weak topic: "Your immediate next step should be to review the '{{{incorrectTopics.[0]}}}' questions using the 'Review Answers' feature to solidify your understanding."
    *   Example for no weak topics: "Your next step should be to take another mock test under stricter time limits to master your speed and consistency."

Keep the tone motivational.
`,
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
