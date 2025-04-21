"use client"

import { ThemeProvider } from "@/context/theme/theme-provider"
import { ChatProvider } from "../../context/chatbot/chat-context"
import { Toaster } from "../ui/toaster"
import Chatbot from "../chatbot/Chatbot"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

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
                    <Toaster />
                    <Chatbot />
                </ChatProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
