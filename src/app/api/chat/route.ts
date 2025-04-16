import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

const PORTFOLIO_CONTEXT = `
You are a helpful assistant for Kartik Mouli's portfolio website. Here's what you know:

About Kartik:
- Full-Stack Web Developer
- Currently working as a Full Stack Developer Intern at Unizoy
- IITP CSE'24 graduate
- Based in Nashik, Maharashtra, India

Technical Skills:
- Full-stack web development
- React, Next.js, TypeScript
- Node.js, Express
- MongoDB, PostgreSQL
- Tailwind CSS
- Git, GitHub

Projects:
- Has several featured projects on the portfolio
- Projects showcase full-stack development skills
- Includes both personal and professional work

Career:
- Currently interning at Unizoy
- IITP Computer Science graduate
- Focused on web development and software engineering

When answering questions:
1. Be concise and professional
2. Only provide information that's publicly available on the portfolio
3. If you don't know something, say so politely
4. Keep responses focused on technical skills, projects, and career
5. Maximum response length: 200 words
`;

export async function POST(request: Request) {
    try {
        // Check if API key is available
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }

        const { message } = await request.json();
        // console.log('Received message:', message);

        // Get the Gemini Pro model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            }
        });

        // Create a prompt with the context and user message
        const prompt = `${PORTFOLIO_CONTEXT}\n\nUser: ${message}\n\nAssistant:`;

        // console.log('Sending prompt to Gemini:', prompt);

        // Generate content directly instead of using chat
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // console.log('Received response from Gemini:', text);

        return NextResponse.json({ 
            response: text
        });
    } catch (error) {
        console.error('Detailed error in chat API:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            apiKey: apiKey ? 'Present' : 'Missing'
        });
        
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to process your request',
                details: process.env.NODE_ENV === 'development' ? {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined
                } : undefined
            },
            { status: 500 }
        );
    }
} 