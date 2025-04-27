"use client"

import { ThemeProvider } from "@/context/theme/theme-provider"
import { ChatProvider } from "../../context/chatbot/chat-context"

import Chatbot from "../chatbot/Chatbot"
import { QueryClientProvider, hydrate } from '@tanstack/react-query'
import getQueryClient from "@/lib/getQueryClient"
import { Toaster } from "../ui/sonner"

interface ProvidersProps {
    children: React.ReactNode;
    dehydratedState?: unknown;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
    const queryClient = getQueryClient()

    // Hydrate the query client with the dehydrated state
    if (dehydratedState) {
        hydrate(queryClient, dehydratedState);
    }
    
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
