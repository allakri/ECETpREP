
'use server';

/**
 * @fileOverview AI-powered answer explanation generator.
 *
 * - explainAnswer - A function that generates an explanation for an incorrect answer.
 * - ExplainAnswerInput - The input type for the explainAnswer function.
 * - ExplainAnswerOutput - The return type for the explainAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAnswerInputSchema = z.object({
  question: z.string().describe('The question the user answered.'),
  options: z.array(z.string()).describe('The multiple-choice options for the question.'),
  userAnswer: z.string().describe("The user's incorrect answer."),
  correctAnswer: z.string().describe('The correct answer for the question.'),
  topic: z.string().describe('The topic of the question.'),
});
export type ExplainAnswerInput = z.infer<typeof ExplainAnswerInputSchema>;

const ExplainAnswerOutputSchema = z.object({
  explanation: z.string().describe("A clear, concise explanation of why the user's answer was incorrect and why the correct answer is right. Use LaTeX for mathematical equations, enclosed in double backslashes, e.g., \\\\frac{1}{2} or x^2."),
});
export type ExplainAnswerOutput = z.infer<typeof ExplainAnswerOutputSchema>;

export async function explainAnswer(input: ExplainAnswerInput): Promise<ExplainAnswerOutput> {
  return explainAnswerFlow(input);
}

const explainAnswerPrompt = ai.definePrompt({
  name: 'explainAnswerPrompt',
  input: {schema: ExplainAnswerInputSchema},
  output: {schema: ExplainAnswerOutputSchema},
  prompt: `You are an expert AI tutor. A student has answered a multiple-choice question incorrectly. Your task is to provide a clear and helpful explanation.

**CRITICAL RULE**: All mathematical formulas, variables, and symbols MUST be formatted using LaTeX syntax (e.g., for fractions use \\\\frac{1}{2}, for powers use x^2, for symbols use \\\\sin(\\theta)). Double backslashes are required.

**Follow these steps:**
1.  Acknowledge the student's answer and state clearly why it is incorrect. Refer to the specific concept they might have misunderstood.
2.  State the correct answer and provide a step-by-step explanation of why it is correct.
3.  Briefly summarize the core concept of the topic to reinforce learning.

Keep the tone supportive and educational.

Question: {{{question}}}
Topic: {{{topic}}}
Options: {{#each options}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

The student incorrectly chose: {{{userAnswer}}}
The correct answer is: {{{correctAnswer}}}

Generate the explanation.
`,
});

const explainAnswerFlow = ai.defineFlow(
  {
    name: 'explainAnswerFlow',
    inputSchema: ExplainAnswerInputSchema,
    outputSchema: ExplainAnswerOutputSchema,
  },
  async input => {
    const {output} = await explainAnswerPrompt(input);
    return output!;
  }
);
