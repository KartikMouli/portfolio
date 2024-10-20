import Image from "next/image";

const TechCard = ({
    cardInfo,
}: {
    cardInfo: {
        name: string;
        description: string;
        imageUrl: string;
        bgColor: string;
    };
}) => {
    const { name, description, imageUrl, bgColor } = cardInfo;

    return (
        <div className="flex items-center gap-4 p-2 rounded-xl border border-transparent bg-[#1E1E1E] hover:bg-[#2a2a2a] transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 hover:border-[#61DAFB]/40">
            <div className={`p-2 ${bgColor} rounded-lg`}>
                <div className="relative w-8 h-8">
                    <Image
                        src={imageUrl}
                        alt={`${name} logo`}
                        fill
                        className="rounded-md"
                    />
                </div>
            </div>
            <div>
                <h5 className="text-sm font-semibold text-white">{name}</h5>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    );
};

export default TechCard;
