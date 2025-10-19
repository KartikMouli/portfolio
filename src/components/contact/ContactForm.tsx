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

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        submitForm(data);
    };

    return (
        <div
            className="w-full max-w-2xl mx-auto p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name and Email Fields */}
                    <div 
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                                    <FormControl>
                                        <div
                                        >
                                            <Input 
                                                placeholder="Your name" 
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                                            />
                                        </div>
                                    </FormControl>
                                        {form.formState.errors.name && (
                                            <div
                                            >
                                                <FormMessage />
                                            </div>
                                        )}
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
                                        <div
                                        >
                                            <Input 
                                                placeholder="Your email" 
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                                            />
                                        </div>
                                    </FormControl>
                                        {form.formState.errors.email && (
                                                <FormMessage />

                                        )}
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Message Field */}
                    <div
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Message</FormLabel>
                                    <FormControl>
                                        <div
                                        >
                                            <Textarea
                                                placeholder="Leave feedback about the site, career opportunities, or just to say hello."
                                                {...field}
                                                rows={4}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </FormControl>
                                        {form.formState.errors.message && (
                                                <FormMessage />
                                        )}
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div
                    >
                        <Button 
                            type="submit" 
                            className="w-full relative overflow-hidden group hover:cursor-pointer"
                            disabled={isPending}
                        >
                            <span
                            >
                                {isPending ? "Sending..." : "Send Message"}
                            </span>
                            <span
                                className="ml-2 inline-flex"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </span>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
