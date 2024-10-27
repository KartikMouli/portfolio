import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const socialLinks = [
    {
        href: "https://linkedin.com/in/kartik-mouli",
        icon: <FaLinkedin className="w-5 h-5" />,
        label: "LinkedIn",
    },
    {
        href: "https://github.com/KartikMouli",
        icon: <FaGithub className="w-5 h-5" />,
        label: "GitHub",
    },
    {
        href: "mailto:kartikmouli156@gmail.com",
        icon: <FaEnvelope className="w-5 h-5" />,
        label: "Email",
    },
    {
        href: "https://x.com/kartikmouli",
        icon: <FaXTwitter className="w-5 h-5" />,
        label: "X",
    },
    {
        href: "https://leetcode.com/u/monchi02/",
        icon: <SiLeetcode className="w-5 h-5" />,
        label: "LeetCode",
    },
];

export default function Socials() {
    return (
        <section className="flex justify-center gap-4 md:gap-5">
            {socialLinks.map(({ href, icon, label }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white transition duration-300 ease-in-out transform hover:scale-110"
                    title={label}
                >
                    <span className="sr-only">{label}</span>
                    {icon}
                </a>
            ))}
        </section>
    );
}
