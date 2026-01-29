import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { prompt, context } = await req.json();

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json", // 🔥 FORCE JSON
      },
    });

    const systemPrompt = `
You are an AI assistant for a todo app.

You MUST ALWAYS respond ONLY in JSON.

Two modes:

1) MEMORY MODE:
If the user asks about past messages or history:
{
  "clarificationNeeded": false,
  "answer": "your answer",
  "todos": []
}

2) TODO MODE:
If the user wants task ideas:
{
  "clarificationNeeded": false,
  "todos": [
    { "title": "", "description": "" }
  ]
}

If unclear:
{
  "clarificationNeeded": true,
  "question": "your question",
  "todos": []
}

Never explain. Never add text outside JSON.
`;

    const result = await model.generateContent([
      systemPrompt,
      context && `Conversation history:\n${context}`,
      `User: ${prompt}`,
    ]);

    const text = result.response.text();

    // 🔒 hard sanitize
    const cleaned = text
      .trim()
      .replace(/^```json/i, "")
      .replace(/```$/, "");

    const json = JSON.parse(cleaned);

    return NextResponse.json(json);
  } catch (err) {
    console.error("Gemini parse error:", err);

    return NextResponse.json({
      clarificationNeeded: false,
      answer: "I had trouble reading that. Can you rephrase?",
      todos: [],
    });
  }
}
