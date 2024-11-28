"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import axios from "axios";
import { formSchema } from "@/lib/schemas";




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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/contact", data);

            if (response.status === 200 && response.data.success) {
                toast({
                    title: "Success",
                    description: "Thanks for reaching out! Your form has been submitted.",
                    variant: "success",
                });
                form.reset(); // Reset form on success
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Message Field */}
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Leave feedback about the site, career opportunities, or just to say hello."
                                    {...field}
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                    {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 w-4 h-4" />
                </Button>
            </form>
        </Form>
    );
}
