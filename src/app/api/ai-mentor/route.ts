
import { generateStrategicGuidance } from "@/ai/flows/strategic-guidance-flow";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // The validation is already handled within the Genkit flow.
    // Calling the flow directly simplifies the API route and avoids potential build issues.
    const result = await generateStrategicGuidance(body);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Mentor API Error:", error);
    // Provide a generic error message. Specifics will be logged on the server.
    return NextResponse.json({ error: "An internal server error occurred while generating the study guide." }, { status: 500 });
  }
}
