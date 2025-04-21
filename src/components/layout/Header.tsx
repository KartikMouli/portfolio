"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";
import ChatToggle from "../chatbot/chatbot-toggle";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";
import { useState } from "react";
import SpotifyNowPlaying from "../spotify/spotify-now-playing";

const navLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Projects",
        href: "/projects",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

const linkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
};

export default function Header() {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.header
            className="sticky top-0 z-50 py-4 sm:py-6 backdrop-blur-xs"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <nav className="container px-4">
                <div className="flex items-center justify-between">
                    
                    {/* Right side - Navigation Links and Icons */}
                    <div className="flex items-center justify-between w-full">
                        {/* Navigation Links - Hidden on mobile */}
                        {!isMobile && (
                            <motion.ul
                                className="flex gap-4 sm:gap-8"
                                initial="initial"
                                animate="animate"
                            >
                                {navLinks.map((nav, id) => (
                                    <motion.li
                                        key={id}
                                        className={`link ${pathname === nav.href ? "dark:text-white font-bold" : ""}`}
                                        variants={linkVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Link href={nav.href}>{nav.name}</Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <SpotifyNowPlaying />
                            <ChatToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobile && (
                        <div className="relative">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="h-9 w-9"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg p-4"
                                >
                                    <div className="flex flex-col gap-2">
                                        {navLinks.map((nav, id) => (
                                            <Link
                                                key={id}
                                                href={nav.href}
                                                className={`text-lg ${pathname === nav.href ? "font-bold" : ""}`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {nav.name}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
