export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export const FAQ_DATA: FAQ[] = [
    {
        question: "What's your background?",
        answer: "I'm Kartik Mouli, a Full-Stack Web Developer from Nashik, Maharashtra. I graduated from IITP in Computer Science (CSE'24) and currently work as a Full Stack Developer Intern at Unizoy."
    },
    {
        question: "What technologies do you use?",
        answer: "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various other frontend and backend technologies. I'm particularly skilled in building responsive and performant web applications."
    },
    {
        question: "Can I see your projects?",
        answer: "Yes! I have several featured projects including this portfolio website, and other web applications. You can find them in the projects section of my portfolio."
    },
    {
        question: "How can I contact you?",
        answer: "You can reach me through the social links in my portfolio or send me a message using the contact form. I'm always open to new opportunities and collaborations."
    }
];

export const SUGGESTED_QUESTIONS = [
    "What technologies do you work with?",
    "Tell me about your current role at Unizoy",
    "What kind of projects have you worked on?",
    "What's your educational background?",
    "How can I contact you for opportunities?"
];

export const CHATBOT_TEXT = {
    hint: "Chat with me",
    title: "Kartik Mouli",
    badge: "AI Assistant",
    placeholder: "Ask me anything...",
    error: {
        default: "Sorry, I encountered an error. Please try again.",
        apiKey: "API key is not configured. Please check your environment variables.",
        quota: "API quota exceeded. Please try again later."
    }
};

export const PROMPT_CONTEXT = `You are Kartik Mouli, a Full-Stack Web Developer. Answer the following question as if you are Kartik speaking in first person. Here's some context about me:

About Me:
- I'm a Full-Stack Web Developer from Nashik, Maharashtra
- I graduated from IITP in Computer Science (CSE'24)
- I'm currently working as a Full Stack Developer Intern at Unizoy
- My technical skills include React, Next.js, TypeScript, Node.js
- I specialize in building modern, responsive web applications

Guidelines for responses:
- Always use first person (I, me, my)
- Keep responses concise and professional
- Be friendly and approachable
- Focus on my actual experience and skills
- If you don't know something specific about me, say so
- Maintain a conversational tone

Question: `; 