"use client"

import { ThemeProvider } from "@/context/theme/theme-provider"
import { ChatProvider } from "../../context/chatbot/chat-context"
import Chatbot from "../chatbot/chatbot"
import { Toaster } from "../ui/sonner"
import { QueryProvider } from "../../context/query-provider"

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <ChatProvider>
                    {children}
                    <Toaster richColors />
                    <Chatbot />
                </ChatProvider>
            </QueryProvider>
        </ThemeProvider>
    )
}
