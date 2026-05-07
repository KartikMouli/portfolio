import ContactForm from '@/components/contact/contact-form';
import { H1, Lead } from '@/components/typography';

function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <H1>Get in Touch</H1>
          <Lead className="max-w-2xl mx-auto">
            Have a question or want to work together? I&apos;d love to hear from
            you. Fill out the form below and I&apos;ll get back to you as soon
            as possible.
          </Lead>
        </div>

        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default Contact;
