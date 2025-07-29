'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/adaptive-feedback.ts';
import '@/ai/flows/readiness-assessment.ts';
import '@/ai/flows/doubt-clearing-flow.ts';
import '@/ai/flows/explain-answer-flow.ts';
import '@/ai/flows/generate-custom-quiz.ts';
