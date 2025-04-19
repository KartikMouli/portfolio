"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import axios from "axios";
import { formSchema } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    // Form container animation variants
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Form field animation variants
    const fieldVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Button animation variants
    const buttonVariants = {
        idle: { scale: 1 },
        hover: { 
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: { scale: 0.98 }
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/contact", data);

            if (response.status === 200 && response.data.success) {
                toast({
                    title: "Success",
                    description: "Thanks for reaching out! Your form has been submitted.",
                    variant: "success",
                });
                form.reset();
            } else {
                toast({
                    title: "Error",
                    description: "Form submission failed. Please try again.",
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Error submitting the form. Please check your connection.",
                variant: "destructive",
            });
        }
    };

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name and Email Fields */}
                    <motion.div 
                        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        variants={fieldVariants}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <Input 
                                                placeholder="Your name" 
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                                            />
                                        </motion.div>
                                    </FormControl>
                                    <AnimatePresence mode="wait">
                                        {form.formState.errors.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <FormMessage />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <Input 
                                                placeholder="Your email" 
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                                            />
                                        </motion.div>
                                    </FormControl>
                                    <AnimatePresence mode="wait">
                                        {form.formState.errors.email && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <FormMessage />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Message Field */}
                    <motion.div
                        variants={fieldVariants}
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <Textarea
                                                placeholder="Leave feedback about the site, career opportunities, or just to say hello."
                                                {...field}
                                                rows={4}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>
                                    </FormControl>
                                    <AnimatePresence mode="wait">
                                        {form.formState.errors.message && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <FormMessage />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        variants={buttonVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button 
                            type="submit" 
                            className="w-full relative overflow-hidden group"
                            disabled={form.formState.isSubmitting}
                        >
                            <motion.span
                                animate={form.formState.isSubmitting ? {
                                    opacity: [1, 0.5, 1],
                                    transition: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                } : {}}
                            >
                                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                            </motion.span>
                            <motion.span
                                className="ml-2 inline-flex"
                                animate={form.formState.isSubmitting ? {
                                    rotate: 360,
                                    transition: {
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                } : {}}
                            >
                                <Send className="w-4 h-4" />
                            </motion.span>
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    );
}
