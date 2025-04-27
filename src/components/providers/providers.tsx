"use client"

import { ThemeProvider } from "@/context/theme/theme-provider"
import { ChatProvider } from "../../context/chatbot/chat-context"

import Chatbot from "../chatbot/Chatbot"
import { QueryClientProvider } from '@tanstack/react-query'
import getQueryClient from "@/lib/getQueryClient"
import { Toaster } from "../ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                <ChatProvider>
                    {children}
                    <Toaster richColors />
                    <Chatbot />
                </ChatProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
