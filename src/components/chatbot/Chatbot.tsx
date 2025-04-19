'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, MessageSquare, X, Bot, Sparkles, ChevronDown, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Message, FAQ, SUGGESTED_QUESTIONS, CHATBOT_TEXT} from '../../data/chatbot';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';



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


    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await axios.post("/api/chat", { message: userMessage });
            setMessages((prev) => [...prev, { role: "assistant", content: response.data.response  }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
            ]);
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
                    className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-full shadow-xs border text-xs text-muted-foreground"
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
                        variant="outline"
                        className="rounded-full w-10 h-10 bg-background/80 text-foreground shadow-xs hover:bg-background/90 transition-all duration-200"
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
                            <Card className="bg-background/90 border shadow-xs">
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
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className={`flex gap-2 ${
                                                                    message.role === "user" ? "justify-end" : "justify-start"
                                                                }`}
                                                            >
                                                                {message.role === "assistant" && (
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback>
                                                                        <Bot className="h-4 w-4" />
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                                <div
                                                                    className={`max-w-[80%] rounded-lg p-2 text-sm ${
                                                                        message.role === "user"
                                                                            ? "bg-primary text-primary-foreground"
                                                                            : "bg-muted"
                                                                    }`}
                                                                >
                                                                    <ReactMarkdown
                                                                        components={{
                                                                            p: ({ children }) => <p className="mb-1.5 last:mb-0 text-sm">{children}</p>,
                                                                            ul: ({ children }) => <ul className="list-disc pl-3 mb-1.5 text-sm">{children}</ul>,
                                                                            ol: ({ children }) => <ol className="list-decimal pl-3 mb-1.5 text-sm">{children}</ol>,
                                                                            li: ({ children }) => <li className="mb-0.5 text-sm">{children}</li>,
                                                                            code: ({ children }) => (
                                                                                <code className="bg-muted-foreground/10 rounded px-1 py-0.5 text-xs">
                                                                                    {children}
                                                                                </code>
                                                                            ),
                                                                            pre: ({ children }) => (
                                                                                <pre className="bg-muted-foreground/10 rounded p-1.5 my-1.5 overflow-x-auto text-xs">
                                                                                    {children}
                                                                                </pre>
                                                                            ),
                                                                            a: ({ href, children }) => (
                                                                                <a
                                                                                    href={href}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-primary hover:underline text-sm"
                                                                                >
                                                                                    {children}
                                                                                </a>
                                                                            ),
                                                                        }}
                                                                    >
                                                                        {message.content}
                                                                    </ReactMarkdown>
                                                                </div>
                                                                {message.role === "user" && (
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback>
                                                                            <User className="h-4 w-4" />
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
                                                    className="h-7 w-7 rounded-full shadow-xs"
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