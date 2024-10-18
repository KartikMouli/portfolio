import data from "@/data/socials.json";
import Icon from "./Icon";
import { TbBrandLeetcode } from "react-icons/tb";
import { SiLeetcode } from "react-icons/si";



export default function Socials() {

    const socials = data.socials

    return (
        <section className="flex gap-6">
            {socials.map((item) => (
                <a
                    href={item.href}
                    key={item.name}
                    target="_blank"
                    className="text-gray-400 hover:text-white"
                    rel="noopener noreferrer"

                >
                    <span className="sr-only">{item.name}</span>
                    <Icon name={item.icon} aria-hidden="true" className="size-5" />
                </a>
            ))}
            <a
                href="https://leetcode.com/u/monchi02/"
                target="_blank"
                className="text-gray-400 hover:text-white"
                rel="noopener noreferrer"

            >
                <span className="sr-only">Leetcode</span>
                <SiLeetcode aria-hidden="true" className="size-5" />
            </a>


        </section >

    );
}