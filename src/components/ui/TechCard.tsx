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
    // Determine opacity based on bgColor
    const opacity = bgColor === "white" ? 0.9 : 0.2;
    return (
        <div className="flex items-center whitespace-nowrap gap-4 p-2 rounded-xl border border-transparent bg-[#1E1E1E] hover:bg-[#2a2a2a] transition-colors duration-300 shadow-md hover:shadow-lg transform hover:border-[#61DAFB]/40" aria-label={`Technology: ${name}, Description: ${description}`}>
            <div className="relative ">
                {/* Background with reduced opacity for the image only */}
                <div
                    className="absolute inset-0 rounded"
                    style={{
                        backgroundColor: bgColor,
                        opacity: opacity
                    }}
                />
                <div className="p-1 rounded-2xl w-fit relative z-10"> {/* Positioning to ensure the image stays above */}
                    <Image
                        src={imageUrl}
                        alt={`${name} logo`}
                        width={40}
                        height={40}
                        className="size-8 rounded"
                    />
                </div>
            </div>
            <div className="relative z-10 text-ellipsis overflow-hidden ..."> {/* Ensure text is above the background */}
                <h5 className="text-sm font-semibold text-white">{name}</h5>
                <p className="text-xs text-gray-400 text-ellipsis overflow-hidden ..." >{description}</p>
            </div>
        </div>
    );
};

export default TechCard;
