import data from "@/data/socials.json";
import Icon from "./ui/Icon";
import { SiLeetcode } from "react-icons/si";
import { FaXTwitter } from 'react-icons/fa6';

export default function Socials() {
    const socials = data.socials;

    return (
        <section className="flex gap-6">
            {socials.map((item) => (
                <a
                    href={item.href}
                    key={item.name}
                    target="_blank"
                    className="text-gray-400 hover:text-white transition duration-300 ease-in-out"
                    rel="noopener noreferrer"
                >
                    <span className="sr-only">{item.name}</span>
                    <Icon name={item.icon} aria-hidden="true" className="w-5 h-5" /> {/* Ensure consistent sizing */}
                </a>
            ))}

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
