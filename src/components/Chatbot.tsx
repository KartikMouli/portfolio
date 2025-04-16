'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageSquare, X, Bot, Sparkles, ChevronDown, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Message, FAQ, FAQ_DATA, SUGGESTED_QUESTIONS, CHATBOT_TEXT, PROMPT_CONTEXT } from '../data/chatbot';



export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // Handle scroll events to show/hide scroll button
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getGenAI = () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
        }
        return new GoogleGenerativeAI(apiKey);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const prompt = `${PROMPT_CONTEXT}${input}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const assistantMessage: Message = { role: 'assistant', content: text };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = CHATBOT_TEXT.error.default;

            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    errorMessage = CHATBOT_TEXT.error.apiKey;
                } else if (error.message.includes('quota')) {
                    errorMessage = CHATBOT_TEXT.error.quota;
                }
            }

            const errorResponse: Message = {
                role: 'assistant',
                content: errorMessage,
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFaqClick = (faq: FAQ) => {
        setInput(faq.question);
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
                {/* Chatbot Hint */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full shadow-sm border text-xs text-muted-foreground"
                >
                    <span>{CHATBOT_TEXT.hint}</span>
                    <motion.div
                        animate={{
                            x: [0, 5, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </motion.div>
                </motion.div>

                {/* Chatbot Button */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full w-12 h-12 bg-background/80 text-foreground shadow-sm hover:bg-background/90 transition-all duration-200"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300
                            }}
                            className="fixed bottom-4 right-4 z-50 w-[350px]"
                        >
                            <Card className="bg-background/90 border shadow-sm">
                                <CardHeader className="p-3 pb-2 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-sm font-medium">{CHATBOT_TEXT.title}</CardTitle>
                                                <Badge variant="secondary" className="text-[10px] h-4 mt-0.5">
                                                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                                                    {CHATBOT_TEXT.badge}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex flex-col h-[400px]">
                                        <ScrollArea
                                            className="flex-1"
                                            ref={scrollAreaRef}
                                            onScroll={handleScroll}
                                        >
                                            <div className="p-3 space-y-3">
                                                {messages.length === 0 ? (
                                                    <div className="space-y-3">
                                                        <p className="text-xs text-muted-foreground">
                                                            Try asking me about:
                                                        </p>
                                                        <div className="grid grid-cols-1 gap-1.5">
                                                            {SUGGESTED_QUESTIONS.map((question, index) => (
                                                                <Button
                                                                    key={index}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-xs h-8 px-3 rounded-lg hover:bg-muted transition-colors justify-start"
                                                                    onClick={() => handleFaqClick({ question, answer: '' })}
                                                                >
                                                                    <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                                    {question}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {messages.map((message, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                                    }`}
                                                            >
                                                                {message.role === 'assistant' && (
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback className="bg-primary/10">
                                                                            <Bot className="h-3 w-3" />
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                                <div
                                                                    className={`max-w-[80%] rounded-lg p-2.5 text-sm ${message.role === 'user'
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted'
                                                                        }`}
                                                                >
                                                                    {message.content}
                                                                </div>
                                                                {message.role === 'user' && (
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback className="bg-muted">
                                                                            <User className="h-3 w-3" />
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                                {isLoading && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="bg-primary/10">
                                                                <Bot className="h-3 w-3" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="bg-muted rounded-lg p-2.5 text-sm">
                                                            <div className="flex gap-1.5">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        </ScrollArea>
                                        {showScrollButton && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-16 right-4"
                                            >
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-7 w-7 rounded-full shadow-sm"
                                                    onClick={scrollToBottom}
                                                >
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                </Button>
                                            </motion.div>
                                        )}
                                        <div className="flex gap-2 p-3 border-t">
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder={CHATBOT_TEXT.placeholder}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                className="h-8 text-sm rounded-full"
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                disabled={isLoading || !input.trim()}
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
} 