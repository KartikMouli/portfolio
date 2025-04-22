"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
            className="sticky top-0 z-50 py-4 sm:py-6 backdrop-blur-sm bg-background/80 dark:bg-background/80 border-b border-border/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <nav className="container">
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
                                        variants={linkVariants}
                                        className={`relative group ${
                                            pathname === nav.href
                                                ? "dark:text-white font-bold"
                                                : ""
                                        }`}
                                    >
                                        <Link
                                            href={nav.href}
                                            className="relative inline-block py-2 text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            {nav.name}
                                            {pathname === nav.href && (
                                                <motion.span
                                                    className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                                                    layoutId="activeIndicator"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                        {/* Icons */}
                        <div className="flex items-center gap-4">
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
                                className="h-9 w-9 relative z-50"
                            >
                                <motion.div
                                    animate={isMenuOpen ? "open" : "closed"}
                                    className="relative w-5 h-5"
                                >
                                    <motion.span
                                        className="absolute h-[2px] w-5 bg-foreground"
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: 45, y: 6 }
                                        }}
                                    />
                                    <motion.span
                                        className="absolute h-[2px] w-5 bg-foreground"
                                        variants={{
                                            closed: { opacity: 1 },
                                            open: { opacity: 0 }
                                        }}
                                    />
                                    <motion.span
                                        className="absolute h-[2px] w-5 bg-foreground"
                                        variants={{
                                            closed: { rotate: 0, y: 8 },
                                            open: { rotate: -45, y: 6 }
                                        }}
                                    />
                                </motion.div>
                            </Button>
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-background/80 dark:bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-4"
                                    >
                                        <div className="flex flex-col gap-2">
                                            {navLinks.map((nav, id) => (
                                                <motion.div
                                                    key={id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: id * 0.1 }}
                                                >
                                                    <Link
                                                        href={nav.href}
                                                        className={`block px-3 py-2 text-sm rounded-md transition-colors
                                                            ${pathname === nav.href 
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
                        </div>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
