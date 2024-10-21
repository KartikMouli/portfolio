import ContactForm from "@/components/ContactForm";

interface ContactProps {
    name: string;
    email: string;
    message: string;
}

const Contact: React.FC<Readonly<ContactProps>> = ({
    name,
    email,
    message,
}) => (
    <div className="mt-8 flex flex-col gap-8 pb-16">

        <h1 className="text-3xl font-bold mb-4">Contact me</h1>

        <ContactForm />
    </div>
);

export default Contact;