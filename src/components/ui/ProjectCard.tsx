import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

// Define the types for project and links
interface ProjectLink {
    href: string;
    name: string;
    icon: string; // Changed from any to string for better type safety
}

interface Project {
    name: string;
    href?: string;
    description: string;
    image?: string;
    tags?: string[];
    links?: ProjectLink[];
}

interface Props {
    project: Project;
}

export function ProjectCard({ project }: Props) {
    const { name, href, description, image, tags, links } = project;

    return (
        <div className="flex flex-col rounded-xl border border-gray-800">
            {/* Images  */}
            <div className="flex flex-col space-y-1.5 p-6">
                {image && (
                    <Link href={href || image}>
                        <Image
                            src={image}
                            alt={name}
                            width={500}
                            height={300}
                            className="h-48 w-full rounded object-cover object-top hover:scale-105 transition-transform duration-300"
                            priority
                        />
                    </Link>
                )}
            </div>

            {/* Title and Desc */}
            <div className="flex flex-col gap-2 p-6 pt-0">
                <h3 className="text-lg text-white font-semibold leading-none tracking-tight">{name}</h3>
                <Markdown className="max-w-full text-pretty font-sans text-sm text-gray-200">
                    {description}
                </Markdown>
            </div>

            {/* Links  and Tags */}
            <div className="flex h-full flex-col justify-between gap-4 items-center p-6 pt-0">
                {tags && tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tags.sort().map((tag) => (
                            <span key={tag} className={`inline-flex bg-[#E6E6FA] text-white bg-opacity-10 px-3 py-1 text-xs rounded-full`}>
                                {tag}
                            </span>

                        ))}
                    </div>
                )}
                {links && links.length > 0 && (
                    <div className="flex flex-row flex-wrap items-start gap-4">
                        {links.sort().map((link, idx) => (
                            <Link href={link?.href} key={idx} target="_blank" className="flex border rounded-md px-2.5 py-0.5 items-center text-[#CCCCCC] hover:text-white transition duration-300" aria-label={`Link to ${link.name}`}>
                                {link.name === "Live Demo" ? <FaExternalLinkAlt className="size-4 mr-2" /> : <FaGithub className="size-4 mr-2" />}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
