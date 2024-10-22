import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub, FaEnvelope, FaLinkedin } from 'react-icons/fa';

export default function Socials() {
    return (
        <section className="flex gap-6">
            <a
                href="https://linkedin.com/in/kartik-mouli"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                rel="noopener noreferrer"
            >
                <span className="sr-only">X</span>
                <FaLinkedin aria-hidden="true" className="w-5 h-5" /> {/* Consistent size */}
            </a>
            <a
                href="https://github.com/KartikMouli"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                rel="noopener noreferrer"
            >
                <span className="sr-only">X</span>
                <FaGithub aria-hidden="true" className="w-5 h-5" /> {/* Consistent size */}
            </a>
            <a
                href="mailto:kartikmouli156@gmail.com"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                rel="noopener noreferrer"
            >
                <span className="sr-only">X</span>
                <FaEnvelope aria-hidden="true" className="w-5 h-5" /> {/* Consistent size */}
            </a>

            <a
                href="https://x.com/kartikmouli"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                rel="noopener noreferrer"
            >
                <span className="sr-only">X</span>
                <FaXTwitter aria-hidden="true" className="w-5 h-5" /> {/* Consistent size */}
            </a>

            <a
                href="https://leetcode.com/u/monchi02/"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                rel="noopener noreferrer"
            >
                <span className="sr-only">Leetcode</span>
                <SiLeetcode aria-hidden="true" className="w-5 h-5" /> {/* Consistent size */}
            </a>
        </section>
    );
}
