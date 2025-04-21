'use client';

import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import Link from "next/link";
import { motion } from "framer-motion";
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
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const hoverVariants = {
        rest: { 
            scale: 1,
            y: 0
        },
        hover: { 
            scale: 1.05,
            y: -2,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        tap: { 
            scale: 0.98,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <motion.section 
            className="flex justify-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {socialLinks.map(({ href, icon, label }) => (
                <motion.div
                    key={label}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial="rest"
                >
                    <motion.div
                        variants={hoverVariants}
                        style={{ originX: 0.5, originY: 0.5 }}
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
                                "text-dark hover:text-foreground"
                            )}
                            title={label}
                        >
                            <motion.span className="sr-only">{label}</motion.span>
                            {icon}
                        </Link>
                    </motion.div>
                </motion.div>
            ))}
        </motion.section>
    );
}
