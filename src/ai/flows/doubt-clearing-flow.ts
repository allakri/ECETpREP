
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
import {courses} from '@/lib/courses';
import type {Course} from '@/lib/courses';

const QuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  topic: z.string(),
});

const SyllabusItemSchema = z.object({
  subject: z.string(),
  topics: z.array(z.string()),
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
  examAnswers: z.record(z.string(), z.string()).optional().describe("A map of question IDs to the user's answers from their last exam."),
  courseContext: z.object({
    title: z.string(),
    syllabus: z.array(SyllabusItemSchema)
  }).optional().describe("The course the user is currently viewing."),
});
export type DoubtClearingInput = z.infer<typeof DoubtClearingInputSchema>;

const DoubtClearingOutputSchema = z.object({
  answer: z.string().describe("The AI tutor's answer to the student's question."),
});
export type DoubtClearingOutput = z.infer<typeof DoubtClearingOutputSchema>;

// Agentic Tool: Define a tool for the AI to get course syllabus information.
const getCourseSyllabus = ai.defineTool(
    {
        name: 'getCourseSyllabus',
        description: 'Get the detailed syllabus for a specific engineering branch/course.',
        inputSchema: z.object({ courseTitle: z.string().describe("The title of the course, e.g., 'Computer Science' or 'Mechanical Engineering'.") }),
        outputSchema: z.custom<Course>(),
    },
    async ({ courseTitle }) => {
        const course = courses.find(c => c.title.toLowerCase().includes(courseTitle.toLowerCase()));
        if (!course) throw new Error(`Course "${courseTitle}" not found.`);
        return course;
    }
);


export async function clearDoubt(input: DoubtClearingInput): Promise<DoubtClearingOutput> {
  return doubtClearingFlow(input);
}

const doubtClearingPrompt = ai.definePrompt({
  name: 'doubtClearingPrompt',
  input: {schema: DoubtClearingInputSchema},
  output: {schema: DoubtClearingOutputSchema},
  tools: [getCourseSyllabus],
  prompt: `You are an expert AI tutor for the ECET (Engineering Common Entrance Test).
{{#if courseContext}}
You are a domain-specific expert for the "{{courseContext.title}}" course. Your persona should reflect deep knowledge in this area.
{{else}}
Your one and only goal is to help students clear their doubts about ECET subjects.
{{/if}}

You MUST follow these rules strictly:
1.  ONLY answer questions related to ECET subjects (like Mathematics, Physics, Chemistry, and specific engineering disciplines).
2.  If the user asks a question that is NOT related to ECET subjects (e.g., movies, politics), politely decline. Gently guide them to stay focused. For example: "My purpose is to help you with ECET preparation. Let's focus on subjects that will help you succeed. Do you have a question about a specific topic?"
3.  Be encouraging and maintain a positive, academic tone.
4.  If a concept is complex, break it down. Use examples or analogies relevant to their field of study.
5.  **TOOL USAGE**: If a student asks for information about a course's syllabus, topics, or subjects (e.g., "What are the hardest topics in Civil Engineering?"), you MUST use the \`getCourseSyllabus\` tool to fetch the information and provide an accurate answer. Do not guess.

{{#if courseContext}}
The user is currently viewing the "{{courseContext.title}}" course. The syllabus includes:
{{#each courseContext.syllabus}}
- {{subject}}: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}
Use this context to frame your examples. If the chat history is empty, your first message must be an introduction acknowledging the user's course. Example: "I am an expert AI tutor for {{courseContext.title}}. How can I help you with your studies in this branch?"
{{/if}}


{{#if examQuestions}}
The user just completed a practice exam. You have their results.
The primary topics from their exam were: {{#each examQuestions}}{{topic}}{{#unless @last}}, {{/unless}}{{/each}}.
Use this context. If they ask a general physics question and you see they took an Electronics exam, use an electronics-based example.

If they ask about their performance (e.g., "Which questions did I get wrong?"), use the provided exam data to answer accurately. Explain WHY the correct answer is right.
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
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
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
