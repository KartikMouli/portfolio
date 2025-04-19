'use client';

import React from 'react';
import { FileDown } from "lucide-react";
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const ResumeButton: React.FC = () => {
    // Button container animation variants
    const buttonVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: { 
            scale: 1.05,
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

    // Icon animation variants
    const iconVariants = {
        hover: {
            y: [0, -3, 0],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
        >
            <Link
                href="https://drive.google.com/file/d/16ebey3K6tIWcpgVi0Gc7zI3mYVpgdHxR/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button 
                    variant="outline" 
                    className="px-3 py-1 relative overflow-hidden group"
                >
                    <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
                    >
                        Resume
                    </motion.span>
                    <motion.div
                        variants={iconVariants}
                        className="inline-flex ml-2"
                    >
                        <FileDown size={22} />
                    </motion.div>
                    <motion.div
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/5"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </Button>
            </Link>
        </motion.div>
    );
};

export default ResumeButton;