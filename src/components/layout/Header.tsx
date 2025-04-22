"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../theme/ThemeToggle";
import ChatToggle from "../chatbot/chatbot-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import SpotifyNowPlaying from "../spotify/spotify-now-playing";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
} from "../resizable-navbar.tsx/resizable-navbar";

const navLinks = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Projects",
        link: "/projects",
    },
    {
        name: "About",
        link: "/about",
    },
    {
        name: "Contact",
        link: "/contact",
    },
];


export default function Header() {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {!isMobile ? (
                <NavBody className="flex items-center justify-between max-w-4xl mx-auto px-4 py-4">
                    <div className="flex-1">
                        <NavItems
                            items={navLinks}
                            onItemClick={() => setIsMenuOpen(false)}
                            className="justify-start space-x-6"
                        />
                    </div>
                    <div className="flex items-center gap-4 ml-8">
                        <SpotifyNowPlaying />
                        <ChatToggle />
                        <ThemeToggle />
                    </div>
                </NavBody>
            ) : (
                <MobileNav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <MobileNavHeader className="flex items-center justify-between w-full px-4 py-4">
                        <div className="flex items-center gap-2">
                            <SpotifyNowPlaying />
                            <ChatToggle />
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-muted/50"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"/>
                                    <path d="m6 6 12 12"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" x2="20" y1="12" y2="12"/>
                                    <line x1="4" x2="20" y1="6" y2="6"/>
                                    <line x1="4" x2="20" y1="18" y2="18"/>
                                </svg>
                            )}
                        </button>
                    </MobileNavHeader>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t"
                            >
                                <div className="flex flex-col gap-2 p-4">
                                    {navLinks.map((nav, id) => (
                                        <motion.div
                                            key={id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: id * 0.1 }}
                                        >
                                            <Link
                                                href={nav.link}
                                                className={`block px-4 py-3 text-sm rounded-md transition-colors
                                                    ${pathname === nav.link 
                                                        ? "bg-primary/10 text-primary font-medium" 
                                                        : "text-foreground/80 hover:bg-muted/50"
                                                    }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {nav.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </MobileNav>
            )}
        </Navbar>
    );
}
