'use client';

import Link from "next/link";
import Socials from "../socials/Socials";
import { motion } from "framer-motion";
import VisitorCounter from "./visit-count/VisitorCounter";

export default function Footer() {
    // Animation variants for the footer container
    const footerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    // Animation variants for footer elements
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

    // Animation variants for links
    const linkVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <motion.footer 
            className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between px-6 pt-6 border-t mt-12"
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <motion.div
                variants={elementVariants}
            >
                <Socials />
            </motion.div>

            <motion.section 
                className="mt-8 sm:mt-0 flex flex-col items-start gap-2"
                variants={elementVariants}
            >
                <motion.div 
                    className="text-center text-sm"
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
                        <Link className="hover:underline" href="/">
                            kartik-portfolio
                        </Link>
                    </motion.span>
                    {" | "}
                    <motion.span
                        whileHover="hover"
                        whileTap="tap"
                        variants={linkVariants}
                        style={{ display: "inline-block" }}
                    >
                        <Link className="hover:underline font-semibold" href="/privacy">
                            Privacy Policy
                        </Link>
                    </motion.span>
                </motion.div>
                <VisitorCounter />
            </motion.section>
        </motion.footer>
    );
}
