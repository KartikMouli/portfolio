'use client';

import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import Link from "next/link";
import { motion } from "framer-motion";

const socialLinks = [
    {
        href: "https://linkedin.com/in/kartik-mouli",
        icon: <FaLinkedin className="w-5 h-5" />,
        label: "LinkedIn",
        colors: {
            light: "#0077B5",
            dark: "#0A66C2"
        }
    },
    {
        href: "https://github.com/KartikMouli",
        icon: <FaGithub className="w-5 h-5" />,
        label: "GitHub",
        colors: {
            light: "#24292e",
            dark: "#c9d1d9"
        }
    },
    {
        href: "mailto:kartikmouli156@gmail.com",
        icon: <FaEnvelope className="w-5 h-5" />,
        label: "Email",
        colors: {
            light: "#EA4335",
            dark: "#FF5A52"
        }
    },
    {
        href: "https://x.com/kartikmouli",
        icon: <FaXTwitter className="w-5 h-5" />,
        label: "X",
        colors: {
            light: "#000000",
            dark: "#ffffff"
        }
    },
    {
        href: "https://leetcode.com/u/monchi02/",
        icon: <SiLeetcode className="w-5 h-5" />,
        label: "LeetCode",
        colors: {
            light: "#FFA116",
            dark: "#FFA116"
        }
    },
];

export default function Socials() {
    // Container animation variants
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

    // Item animation variants
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Hover animation variants
    const hoverVariants = {
        rest: { scale: 1 },
        hover: { 
            scale: 1.2,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: { 
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    return (
        <motion.section 
            className="flex justify-center gap-4 md:gap-5"
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
                            className="flex items-center justify-center w-8 h-8"
                            title={label}
                        >
                            <motion.span 
                                className="sr-only"
                            >
                                {label}
                            </motion.span>
                            <motion.div
                                className="text-gray-700 dark:text-gray-300 transition-colors duration-200"
                                whileHover={{
                                    color: `var(--social-${label.toLowerCase()}-color)`,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {icon}
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            ))}
        </motion.section>
    );
}
