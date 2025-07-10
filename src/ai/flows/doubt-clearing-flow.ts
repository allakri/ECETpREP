'use server';

/**
 * @fileOverview An AI-powered chat agent for clearing student doubts.
 *
 * - clearDoubt - A function that handles the doubt-clearing process.
 * - DoubtClearingInput - The input type for the clearDoubt function.
 * - DoubtClearingOutput - The return type for the clearDoubt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MessageData} from 'genkit/experimental/ai';

const DoubtClearingInputSchema = z.object({
  question: z.string().describe('The student\'s question or doubt.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({text: z.string()})),
      })
    )
    .describe('The conversation history.') as z.ZodType<MessageData[]>,
});
export type DoubtClearingInput = z.infer<typeof DoubtClearingInputSchema>;

const DoubtClearingOutputSchema = z.object({
  answer: z.string().describe("The AI tutor's answer to the student's question."),
});
export type DoubtClearingOutput = z.infer<typeof DoubtClearingOutputSchema>;

export async function clearDoubt(input: DoubtClearingInput): Promise<DoubtClearingOutput> {
  return doubtClearingFlow(input);
}

const doubtClearingPrompt = ai.definePrompt({
  name: 'doubtClearingPrompt',
  input: {schema: DoubtClearingInputSchema},
  output: {schema: DoubtClearingOutputSchema},
  prompt: `You are an expert AI tutor specializing in all subjects covered by the ECET (Engineering Common Entrance Test). Your role is to help students clear their doubts.

You will be given a student's question and the conversation history. Provide a clear, concise, and helpful explanation to resolve their doubt.
Be encouraging and maintain a positive tone. If a concept is complex, break it down into smaller, easy-to-understand parts.
Use examples or analogies where appropriate.

Converse with the user based on the history and their latest question.

{{#if history}}
History:
{{#each history}}
  {{#ifEquals role "user"}}
    Student: {{#each parts}}{{text}}{{/each}}
  {{/ifEquals}}
  {{#ifEquals role "model"}}
    Tutor: {{#each parts}}{{text}}{{/each}}
  {{/ifEquals}}
{{/each}}
{{/if}}

Student's Question: {{{question}}}

Your Answer:
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

const doubtClearingFlow = ai.defineFlow(
  {
    name: 'doubtClearingFlow',
    inputSchema: DoubtClearingInputSchema,
    outputSchema: DoubtClearingOutputSchema,
  },
  async input => {
    const {output} = await doubtClearingPrompt(input);
    return output!;
  }
);
