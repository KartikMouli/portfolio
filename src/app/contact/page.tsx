'use client';

import ContactForm from '@/components/contact/contact-form';

function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Have a question or want to work together? I&apos;d love to hear from
            you. Fill out the form below and I&apos;ll get back to you as soon
            as possible.
          </p>
        </div>

        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default Contact;
