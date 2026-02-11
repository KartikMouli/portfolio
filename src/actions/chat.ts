'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROMPT_CONTEXT } from '@/data/chatbot';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function sendChatMessage(
  message: string
): Promise<{ response?: string; error?: string }> {
  try {
    if (!message) {
      return { error: 'Message is required' };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
          role: 'user',
          parts: [{ text: `${PROMPT_CONTEXT}\n\n${markdownInstructions}` }],
        },
        {
          role: 'model',
          parts: [
            {
              text: "I understand. I'll help answer questions about Kartik's portfolio, projects, and career while maintaining a professional and friendly tone. I'll format my responses using markdown for better readability.",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return { response: text };
  } catch (error) {
    console.error('Chatbot Action Error:', error);
    return { error: 'Failed to process chat message' };
  }
}
