
'use server';

/**
 * @fileOverview AI-powered strategic guidance generator for specific courses.
 *
 * - generateStrategicGuidance - A function that generates a study guide.
 * - StrategicGuidanceInput - The input type for the function.
 * - StrategicGuidanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SyllabusItemSchema = z.object({
  subject: z.string(),
  topics: z.array(z.string()),
});

export const StrategicGuidanceInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
  syllabus: z.array(SyllabusItemSchema).describe('The structured syllabus for the course.'),
});
export type StrategicGuidanceInput = z.infer<typeof StrategicGuidanceInputSchema>;

export const StrategicGuidanceOutputSchema = z.object({
  guidance: z.string().describe('A comprehensive, well-structured study guide in Markdown format. It should include topic difficulty breakdown, study strategies, and mentorship advice.'),
});
export type StrategicGuidanceOutput = z.infer<typeof StrategicGuidanceOutputSchema>;


export async function generateStrategicGuidance(input: StrategicGuidanceInput): Promise<StrategicGuidanceOutput> {
  return strategicGuidanceFlow(input);
}


const strategicGuidancePrompt = ai.definePrompt({
  name: 'strategicGuidancePrompt',
  input: {schema: StrategicGuidanceInputSchema},
  output: {schema: StrategicGuidanceOutputSchema},
  prompt: `You are an expert AI Mentor and strategist for students preparing for diploma-level entrance exams in India. Your current student is focusing on the "{{courseTitle}}" course.

Your task is to act as a perfect mentor and generate a comprehensive, actionable study guide based on the provided syllabus.

**IMPORTANT RULES:**
1.  Use Markdown for all formatting (headings, subheadings, lists, bold text).
2.  Your tone must be encouraging, clear, and highly strategic.
3.  The advice must be tailored specifically to the subjects and topics provided in the syllabus.

**Follow this exact structure for your response:**

### 1. Topic Difficulty Breakdown

Analyze the syllabus and categorize the topics for a beginner.
-   Create a list under a heading "**Foundation First (Easiest to Start)**". These should be fundamental topics that unlock other concepts.
-   Create a list under a heading "**Core Concepts (Medium Difficulty)**". These are the most important, high-weightage topics.
-   Create a list under a heading "**Mastery Challenge (Hardest Topics)**". These require more time and practice.

### 2. Time-Saving Study Strategies

Provide actionable strategies to learn effectively.
-   Create a section titled "**Smart Study Hacks**".
-   Include at least 3-4 specific, creative tips. For example: "Use the 'Feynman Technique' for difficult topics: try to explain it simply in your own words. If you can't, you don't understand it yet." or "Focus on Previous Year Questions (PYQs) for high-weightage topics to understand the pattern."

### 3. Your Personalized Mentor Advice

Give the student a final, motivational push with a clear action plan.
-   Create a section titled "**Your Mentor's Edge**".
-   Write a short, encouraging paragraph.
-   Provide a "First 2-Week Action Plan" as a simple bulleted list to give them a clear starting point.

**Course Information:**
-   **Course Title:** {{courseTitle}}
-   **Syllabus:**
    {{#each syllabus}}
    -   **{{subject}}**: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    {{/each}}

Generate the complete study guide now based on these instructions.
`,
});

const strategicGuidanceFlow = ai.defineFlow(
  {
    name: 'strategicGuidanceFlow',
    inputSchema: StrategicGuidanceInputSchema,
    outputSchema: StrategicGuidanceOutputSchema,
  },
  async input => {
    const {output} = await strategicGuidancePrompt(input);
    return output!;
  }
);
