"use client"
import React from 'react'
import { Send } from 'lucide-react';
import Link from 'next/link';

type Props = {}

function ContactForm({ }: Props) {
    return (
        <form>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* Name */}

                <div className='h-16'>
                    <input id="name" type="text" placeholder="Name"
                        autoComplete="given-name" className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' />
                </div>

                {/* Email */}

                <div className='h-16'>
                    <input id="email" type="email" placeholder='Email' autoComplete='email' className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50' />
                </div>

                {/* Message */}

                <div className='h-32 sm:col-span-2'>
                    <textarea rows={4} placeholder='Leave feedback about the site, career opportunities or just to say hello etc.' autoComplete="Message" className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none" />
                </div>
            </div>

            {/* Send message */}

            <div className="mt-2">
                <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium w-full bg-white text-[#111111] shadow hover:bg-white/90 h-9 px-4 py-2'>
                    <div className='flex items-center'>
                        <span>Send Message</span>
                        <Send className="ml-2" />
                    </div>
                </button>

                <p className="mt-4 text-xs text-muted-foreground">
                    By submitting this form, I agree to the{" "}
                    <Link href="/privacy" className="link font-semibold">
                        privacy&nbsp;policy.
                    </Link>
                </p>
            </div>
        </form>
    )
}

export default ContactForm