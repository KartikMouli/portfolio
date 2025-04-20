"use client"

import { ThemeProvider } from "@/context/theme/theme-provider"
import { SpotifyProvider } from "../../context/spotify/spotify-context"
import { ChatProvider } from "../../context/chatbot/chat-context"
import { Toaster } from "../ui/toaster"
import Chatbot from "../chatbot/Chatbot"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ChatProvider>
                <SpotifyProvider>
                    {children}
                </SpotifyProvider>
                <Toaster />
                <Chatbot />
            </ChatProvider>
        </ThemeProvider>
    )
}
