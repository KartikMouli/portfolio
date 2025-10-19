'use client';

import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import Link from "next/link";
import { cn } from "@/lib/utils";

const socialLinks = [
    {
        href: "https://linkedin.com/in/kartik-mouli",
        icon: <FaLinkedin className="w-4 h-4" />,
        label: "LinkedIn"
    },
    {
        href: "https://github.com/KartikMouli",
        icon: <FaGithub className="w-4 h-4" />,
        label: "GitHub"
    },
    {
        href: "mailto:kartikmouli156@gmail.com",
        icon: <FaEnvelope className="w-4 h-4" />,
        label: "Email"
    },
    {
        href: "https://x.com/kartikmouli",
        icon: <FaXTwitter className="w-4 h-4" />,
        label: "X"
    },
    {
        href: "https://leetcode.com/u/monchi02/",
        icon: <SiLeetcode className="w-4 h-4" />,
        label: "LeetCode"
    },
];

export default function Socials() {
    return (
        <section 
            className="flex justify-center gap-3"
        >
            {socialLinks.map(({ href, icon, label }) => (
                <div
                    key={label}
                >
                        <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full",
                                "bg-transparent hover:bg-accent/50",
                                "transition-all duration-300",
                                "border border-border/50 hover:border-border",
                                "text-dark hover:text-foreground",
                                "hover:cursor-pointer hover:scale-110 transition-all duration-300"
                            )}
                            title={label}
                        >
                            <span className="sr-only">{label}</span>
                            {icon}
                        </Link>
                </div>
            ))}
        </section>
    );
}
