import TechCard from "./ui/TechCard";
import data from "@/data/skills.json";

const Skills = () => {
    const techCardsItems = data.currentTech;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4">
            {techCardsItems.length > 0 ? (
                techCardsItems.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))
            ) : (
                <p className="text-gray-300">No skills available.</p> // Updated message if no skills found
            )}
        </div>
    );
};

export default Skills;
