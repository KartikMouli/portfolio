"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../theme/theme-toggle";
import ChatToggle from "../chatbot/chatbot-toggle";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import SpotifyNowPlaying from "../spotify/spotify-now-playing";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
} from "../resizable-navbar/resizable-navbar";
import { MenuIcon, XIcon } from "lucide-react";

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
                    <div className="flex items-center gap-4 ml-8 relative z-[60]">
                        <SpotifyNowPlaying />
                        <div className="flex items-center gap-2">
                            <ChatToggle />
                            <ThemeToggle />
                        </div>
                    </div>
                </NavBody>
            ) : (
                <MobileNav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <MobileNavHeader className="flex items-center justify-between w-full px-4 py-4">
                        <div className="flex items-center gap-2 relative z-[60]">
                            <SpotifyNowPlaying />
                            <div className="flex items-center gap-2">
                                <ChatToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-muted/50"
                        >
                            {isMenuOpen ? (
                                <XIcon className="size-5" />
                            ) : (
                                <MenuIcon className="size-5" />
                            )}
                        </button>
                    </MobileNavHeader>

                    {isMenuOpen && (
                        <div
                            className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t"
                        >
                            <div className="flex flex-col gap-2 p-4">
                                {navLinks.map((nav, id) => (
                                    <div
                                        key={id}
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </MobileNav>
            )}
        </Navbar>
    );
}
