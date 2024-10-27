"use client";
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Link from 'next/link';
import Modal from './ui/Modal';

function ContactForm() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { name, email, message } = formState;

        // Simple validation
        if (!name || !email || !message) {
            setErrorMessage("All fields are required!");
            return;
        }

        setErrorMessage('');
        setLoading(true); // Start loading

        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_PUBLIC_ACCESS_KEY;

        if (!accessKey) {
            setErrorMessage("Submission error: Access key is missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    name,
                    email,
                    message,
                }),
            });

            const result = await response.json();

            console.log(result)

            if (response.ok && result.success) {
                setSuccessMessage("Thanks for reaching out! Your form has been submitted.");
                setIsModalOpen(true); // Open the modal
                setFormState({ name: '', email: '', message: '' });
            } else {
                setErrorMessage("Form submission failed. Please try again.");
                setIsModalOpen(true); // Open the modal
            }
        } catch (error) {
            setErrorMessage("Error submitting the form. Please check your connection.");
            setIsModalOpen(true); // Open the modal
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSuccessMessage(''); // Clear success message
        setErrorMessage(''); // Clear error message
    };

    // Determine modal message and title based on success or error
    const modalMessage = successMessage || errorMessage;
    const modalTitle = successMessage ? "Success" : "Error";

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* Name */}
                    <div className='h-16'>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            autoComplete="given-name"
                            value={formState.name}
                            onChange={handleChange}
                            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>

                    {/* Email */}
                    <div className='h-16'>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder='Email'
                            autoComplete='email'
                            value={formState.email}
                            onChange={handleChange}
                            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>

                    {/* Message */}
                    <div className='h-32 sm:col-span-2'>
                        <label htmlFor="message" className="sr-only">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={4}
                            placeholder='Leave feedback about the site, career opportunities, or just to say hello.'
                            autoComplete="Message"
                            value={formState.message}
                            onChange={handleChange}
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>
                </div>

                

                {/* Send message */}
                <div className="mt-2">
                    <button
                        type="submit"
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium w-full bg-white text-[#111111] shadow hover:bg-white/90 h-9 px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? (
                            <span>Loading...</span> // Loading indicator
                        ) : (
                            <div className='flex items-center'>
                                <span>Send Message</span>
                                <Send className="ml-2" />
                            </div>
                        )}
                    </button>

                    <p className="mt-4 text-xs text-muted-foreground">
                        By submitting this form, I agree to the{" "}
                        <Link href="/privacy" className="link font-semibold">
                            privacy&nbsp;policy.
                        </Link>
                    </p>
                </div>
            </form>

            {/* Modal for success or error message */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                message={modalMessage}
                title={modalTitle}
            />
        </>
    )
}

export default ContactForm;
