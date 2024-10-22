import Link from "next/link";

const lastUpdated = "Oct 2024";

export default function page() {
    return (
        <article className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
                <h1 className="text-5xl font-bold text-gray-100">Privacy Policy</h1>
                <p className="text-gray-400">Last Updated: {lastUpdated}</p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                <h2 className="text-3xl font-semibold text-gray-200">Welcome!</h2>
                <p className="text-gray-300">
                    Thanks for visiting! This <b>Privacy Policy</b> explains how things work here. My site is primarily for showcasing my work, and I take your privacy seriously.
                </p>

                <h2 className="text-3xl font-semibold text-gray-200">Information I Collect (Spoiler: It's Not Much)</h2>
                <p className="text-gray-300">
                    Since this is a static portfolio, I don’t collect any personal data. No account creation, tracking cookies, or hidden data collection.
                </p>

                <h3 className="text-2xl font-semibold text-gray-200">Contact Information</h3>
                <p className="text-gray-300">
                    If you contact me via email or the form, it’s up to you what information you share. I’ll only use it to respond to your message—nothing else.
                </p>

                <h2 className="text-3xl font-semibold text-gray-200">How I Use the Information</h2>
                <p className="text-gray-300">If I do receive any info, here’s what I might do with it:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Ensure the website is functioning properly</li>
                    <li>Improve the site based on your feedback</li>
                    <li>Respond to any inquiries or feedback you provide</li>
                </ul>

                <h2 className="text-3xl font-semibold text-gray-200">Sharing Information (I Don’t)</h2>
                <p className="text-gray-300">
                    I don’t sell, trade, or share your personal data. If you mistakenly share any sensitive information, feel free to reach out, and I’ll help you remove it.
                </p>

                <h2 className="text-3xl font-semibold text-gray-200">Security (No System Is Perfect)</h2>
                <p className="text-gray-300">
                    While I do my best to keep your data secure, no system is flawless. I’ll take reasonable steps to protect any shared info, but I can’t guarantee absolute security.
                </p>

                <h2 className="text-3xl font-semibold text-gray-200">Policy Updates (Keeping You Informed)</h2>
                <p className="text-gray-300">
                    This policy is up to date as of <b>{lastUpdated}</b>. If there are any changes, I’ll update this page. Feel free to check back, but I’ll let you know if there are any major updates.
                </p>

                {/* Contact Section with Button */}
                <h2 className="text-3xl font-semibold text-gray-200">Have Questions?</h2>
                <p className="text-gray-300 pb-2">
                    Got any questions, concerns, or just want to say hello? You can email me at{" "}
                    <Link href="mailto:kartikmouli156@gmail.com" className="font-semibold text-blue-500 underline hover:text-blue-300">kartikmouli156@gmail.com</Link>
                    {" "}or use the{" "}
                    <Link href="/contact" className="font-semibold text-blue-500 underline hover:text-blue-300">contact form</Link>.
                </p>

                <Link href="/contact">
                    <button className="mt-6 border text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition duration-300">Contact Me</button>
                </Link>
            </div>
        </article>
    );
}
