'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Loader2 } from 'lucide-react';
import { formSchema } from '@/lib/schemas';
import { toast } from 'sonner';

export default function ContactForm() {
  type Web3FormsResponse = {
    success?: boolean;
    message?: string;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const [isPending, setIsPending] = useState(false);
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!accessKey) {
      toast.error('Configuration error', {
        description: 'Missing NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY',
      });
      return;
    }

    setIsPending(true);

    try {
      const payload = {
        access_key: accessKey,
        name: data.name,
        email: data.email,
        message: data.message,
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload, null, 2),
      });

      const result = (await response.json()) as Web3FormsResponse;

      if (response.ok && result.success) {
        toast.success('Successfully submitted form', {
          description:
            'Thanks for reaching out! I will get back to you as soon as possible.',
        });
        form.reset();
        return;
      }

      toast.error('Error submitting the form', {
        description: result.message || 'Please check your connection.',
      });
    } catch {
      toast.error('Error submitting the form', {
        description: 'Please check your connection.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name and Email Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.name && (
                    <div>
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
                    <div>
                      <Input
                        placeholder="Your email"
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.email && <FormMessage />}
                </FormItem>
              )}
            />
          </div>

          {/* Message Field */}
          <div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Message</FormLabel>
                  <FormControl>
                    <div>
                      <Textarea
                        placeholder="Leave feedback about the site, career opportunities, or just to say hello."
                        {...field}
                        rows={4}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.message && <FormMessage />}
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full relative overflow-hidden group hover:cursor-pointer"
              disabled={isPending}
            >
              <span>{isPending ? 'Sending...' : 'Send Message'}</span>
              <span className="ml-2 inline-flex">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
