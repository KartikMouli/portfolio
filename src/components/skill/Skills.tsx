import TechCard from "../tech-card/TechCard";
import data from "@/data/skills.json";

const Skills = () => {
    const techCardsItems = data.currentTech;

    return (
        <div
            className="grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
        >
            {techCardsItems.length > 0 ? (
                techCardsItems.map((cardItem) => (
                    <div
                        key={cardItem.name}
                    >
                        <TechCard cardInfo={cardItem} />
                    </div>
                ))
            ) : (
                <p className="dark:text-gray-300">No skills available.</p>
            )}
        </div>
    );
};

export default Skills;
