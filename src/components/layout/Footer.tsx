'use client';

import Link from "next/link";
import Socials from "../socials/Socials";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    const footerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const elementVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const linkVariants = {
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.98
        }
    };

    return (
        <motion.footer
            className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between px-6 py-8 border-t border-border/40 mt-12"
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <motion.div
                variants={elementVariants}
                className="mb-6 sm:mb-0"
            >
                <Socials />
            </motion.div>

            <motion.section
                className="flex flex-col items-center sm:items-start gap-3 text-sm text-muted-foreground/80"
                variants={elementVariants}
            >
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-2"
                    variants={elementVariants}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        &copy; {new Date().getFullYear()}{" "}
                    </motion.span>
                    <motion.span
                        whileHover="hover"
                        whileTap="tap"
                        variants={linkVariants}
                        style={{ display: "inline-block" }}
                    >
                        <Link 
                            className="hover:text-foreground transition-colors" 
                            href="/"
                        >
                            kartik-portfolio
                        </Link>
                    </motion.span>
                    <Separator orientation="vertical" className="h-4" />
                    <motion.span
                        whileHover="hover"
                        whileTap="tap"
                        variants={linkVariants}
                        style={{ display: "inline-block" }}
                    >
                        <Link 
                            className="hover:text-foreground transition-colors" 
                            href="/privacy"
                        >
                            Privacy Policy
                        </Link>
                    </motion.span>
                </motion.div>
            </motion.section>
        </motion.footer>
    );
}
