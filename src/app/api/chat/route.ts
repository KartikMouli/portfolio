import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PROMPT_CONTEXT } from "@/data/chatbot";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Start a chat session with markdown formatting instruction
    const markdownInstructions = `Please format your responses using markdown for better readability. Use:
- **bold** for emphasis
- *italics* for subtle emphasis
- \`code\` for technical terms
- \`\`\` for code blocks
- - or * for lists
- [links](url) for references`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `${PROMPT_CONTEXT}\n\n${markdownInstructions}` }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll help answer questions about Kartik's portfolio, projects, and career while maintaining a professional and friendly tone. I'll format my responses using markdown for better readability." }],
        },
      ],
    });

    // Send the message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
} 