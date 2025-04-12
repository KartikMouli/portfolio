'use client';  // Add this at the top since we're using client-side animations

import React from 'react';
import data from "@/data/skills.json";
import TechCard from '@/components/TechCard';
import { motion } from 'framer-motion';

// Define the type for each tech item
interface TechItem {
    name: string;
    description: string;
    imageUrl: string;
    bgColor: string;
}

// Define the props for the TechCategory component
interface TechCategoryProps {
    title: string;
    techItems: TechItem[];
    index: number; // Add index prop for staggered animations
}

const TechCategory: React.FC<TechCategoryProps> = ({ title, techItems, index }) => {
    // Animation variants for the category container
    const categoryVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.2, // Stagger each category
                when: "beforeChildren",
                staggerChildren: 0.1,
            }
        }
    };

    // Animation variants for each tech card
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            className='mt-4'
            variants={categoryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            <motion.h3 className='text-xl'>{title}</motion.h3>
            <motion.div className="mt-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4">
                {techItems.map((cardItem) => (
                    <motion.div
                        key={cardItem.name}
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <TechCard cardInfo={cardItem} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

const Page: React.FC = () => {
    const {
        Programming_Languages,
        WebDevelopment_Tech,
        Database_Technologies,
        DevOps_Deployment_Tools
    } = data;

    // Animation variants for the main container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
            }
        }
    };

    return (
        <motion.div 
            className='mt-8 flex flex-col gap-8 pb-16 p-1'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Development stack I&apos;m familiar with
            </motion.h1>

            <TechCategory title="Programming languages" techItems={Programming_Languages} index={0} />
            <TechCategory title="Web development technologies" techItems={WebDevelopment_Tech} index={1} />
            <TechCategory title="Database technologies" techItems={Database_Technologies} index={2} />
            <TechCategory title="DevOps & Deployment tools" techItems={DevOps_Deployment_Tools} index={3} />
        </motion.div>
    );
};

export default Page;
