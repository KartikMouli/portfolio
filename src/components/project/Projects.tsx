'use client';

import data from "@/data/projects.json";
import { ProjectCard } from "./ProjectCard";
import { motion } from "framer-motion";

interface Props {
    limit?: number;
}

export default function Projects({ limit }: Props) {
    let projects = data.projects;
    if (limit) {
        projects = projects.slice(0, limit);
    }

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Delay between each project card
                delayChildren: 0.1,   // Initial delay before starting animations
            }
        }
    };

    // Item animation variants
    const itemVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section 
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            {projects.map((project, id) => (
                <motion.div
                    key={id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <ProjectCard project={project} />
                </motion.div>
            ))}
        </motion.section>
    );
}