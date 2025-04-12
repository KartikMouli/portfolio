import TechCard from "./TechCard";
import data from "@/data/skills.json";
import { motion } from "framer-motion";

const Skills = () => {
    const techCardsItems = data.currentTech;

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Delay between each child animation
                delayChildren: 0.3, // Delay before starting the children animations
            },
        },
    };

    // Item animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {techCardsItems.length > 0 ? (
                techCardsItems.map((cardItem) => (
                    <motion.div
                        key={cardItem.name}
                        variants={itemVariants}
                    >
                        <TechCard cardInfo={cardItem} />
                    </motion.div>
                ))
            ) : (
                <p className="dark:text-gray-300">No skills available.</p>
            )}
        </motion.div>
    );
};

export default Skills;
