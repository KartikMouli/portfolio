import ContactForm from "@/components/ContactForm";



const Contact: React.FC = () => (
    <div className="mt-8 flex flex-col gap-8 pb-16 p-6 rounded-lg shadow-md max-w- mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Contact me</h1>
        <p className="text-gray-300 mb-4">I’d love to hear from you! Please fill out the form below.</p>
        <ContactForm />
    </div>
);

export default Contact;
