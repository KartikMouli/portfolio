"use client";

import ContactForm from "@/components/contact/ContactForm";
import { motion } from "framer-motion";

function Contact() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                variants={itemVariants}
                className="w-full max-w-4xl mx-auto space-y-8"
            >
                <div className="text-center space-y-4">
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        Have a question or want to work together? I'd love to hear from you. 
                        Fill out the form below and I'll get back to you as soon as possible.
                    </motion.p>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-8"
                >
                    <ContactForm />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Contact;
