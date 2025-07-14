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

const QuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  topic: z.string(),
});

const DoubtClearingInputSchema = z.object({
  question: z.string().describe("The student's question or doubt."),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({text: z.string()})),
      })
    )
    .describe('The conversation history.') as z.ZodType<MessageData[]>,
  examQuestions: z.array(QuestionSchema).optional().describe("The list of questions from the user's last exam."),
  examAnswers: z.record(z.string(), z.string()).optional().describe("A map of question IDs to the user's answers from their last exam.")
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
  prompt: `You are an expert AI tutor for the ECET (Engineering Common Entrance Test). Your one and only goal is to help students clear their doubts about ECET subjects.

You MUST follow these rules strictly:
1.  ONLY answer questions related to ECET subjects (like Mathematics, Physics, Chemistry, and specific engineering disciplines like Electronics, Computer Science, etc.).
2.  If the user asks a question that is NOT related to ECET subjects (e.g., about movies, politics, personal opinions, or other exams), you MUST politely decline to answer. Gently guide them to stay focused on their exam preparation. For example, say: "That's an interesting question, but my purpose is to help you with your ECET preparation. Let's focus on the subjects that will help you succeed. Do you have a question about a specific topic from your exam?"
3.  Be encouraging and maintain a positive, academic tone.
4.  If a concept is complex, break it down into smaller, easy-to-understand parts. Use examples or analogies relevant to their field of study.

{{#if examQuestions}}
The user has just completed a practice exam. You have access to the questions and their answers.
The primary topics from their exam were: {{#each examQuestions}}{{topic}}{{#unless @last}}, {{/unless}}{{/each}}.
Use this context. For example, if they ask a general physics question and you see they took an Electronics exam, use an electronics-based example to explain the concept.

If they ask about their performance (e.g., "Which questions did I get wrong?", "What was the answer to question 3?"), use the provided exam data to answer them accurately. Explain WHY the correct answer is right, especially for the ones they got wrong.

Here is the exam data:
Total Questions: {{examQuestions.length}}

Questions:
{{#each examQuestions}}
  ID: {{id}}
  Question: {{question}}
  Options: {{#each options}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Correct Answer: {{correctAnswer}}
  Topic: {{topic}}
{{/each}}

Student's Answers (Question ID: Answer):
{{#each examAnswers}}
  {{@key}}: {{{this}}}
{{/each}}
{{/if}}

Converse with the user based on the history and their latest question, following all the rules above.

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
