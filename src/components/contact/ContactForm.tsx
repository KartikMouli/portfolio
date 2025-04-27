"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl
} from "../ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";
import { formSchema } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ContactForm() {
   

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const { mutate: submitForm, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const response = await axios.post("/api/contact", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Successfully submitted form",{
                description: "Thanks for reaching out! I will get back to you as soon as possible.",
            });
            form.reset();
        },
        onError: () => {
            toast.error("Error submitting the form",{
                description: "Please check your connection.",
            });
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

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        submitForm(data);
    };

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl mx-auto p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name and Email Fields */}
                    <motion.div 
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        variants={fieldVariants}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Name</FormLabel>
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
                                    <FormLabel className="text-sm font-medium">Email</FormLabel>
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
                                    <FormLabel className="text-sm font-medium">Message</FormLabel>
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
                            disabled={isPending}
                        >
                            <motion.span
                                animate={isPending ? {
                                    opacity: [1, 0.5, 1],
                                    transition: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                } : {}}
                            >
                                {isPending ? "Sending..." : "Send Message"}
                            </motion.span>
                            <motion.span
                                className="ml-2 inline-flex"
                                animate={isPending ? {
                                    rotate: 360,
                                    transition: {
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                } : {}}
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </motion.span>
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    );
}
