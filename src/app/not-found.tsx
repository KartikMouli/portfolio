'use client';

import { Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1 
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div 
            className="min-h-[80vh] flex flex-col items-center justify-center p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="w-full max-w-4xl mx-auto text-center">
                {/* 404 Display */}
                <motion.div 
                    className="relative mb-8"
                    variants={itemVariants}
                >
                    <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-purple-400">
                        404
                    </h1>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="space-y-6"
                    variants={itemVariants}
                >
                    <h2 className="text-4xl font-bold">
                        Page Not Found
                    </h2>
                    
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Oops! Looks like you&apos;ve ventured into uncharted territory. 
                        Don&apos;t worry, even the best explorers get lost sometimes.
                    </p>

                    <motion.div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                        variants={itemVariants}
                    >
                        <Link href="/">
                            <motion.button
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </motion.button>
                        </Link>
                        
                        <Link href="/contact">
                            <motion.button
                                className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Report This Issue
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                </div>
            </div>
        </motion.div>
    );
}
