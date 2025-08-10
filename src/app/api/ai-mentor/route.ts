
import { generateStrategicGuidance, StrategicGuidanceInputSchema } from "@/ai/flows/strategic-guidance-flow";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = StrategicGuidanceInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid input", details: validationResult.error.flatten() }, { status: 400 });
    }

    const input = validationResult.data;
    const result = await generateStrategicGuidance(input);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Mentor API Error:", error);
    return NextResponse.json({ error: "An internal server error occurred while generating the study guide." }, { status: 500 });
  }
}
