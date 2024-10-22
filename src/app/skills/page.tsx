import React from 'react'
import data from "@/data/skills.json"
import TechCard from '@/components/ui/TechCard'


function page() {

    const Programming_Languages = data.Programming_Languages
    const WebDevelopment_Tech = data.WebDevelopment_Tech
    const Database_Technologies = data.Database_Technologies
    const DevOps_Deployment_Tools = data.DevOps_Deployment_Tools

    return (
        <div className='mt-8 flex flex-col gap-8 pb-16 p-1'>

            <h1 className="text-2xl font-semibold">Development Stack I&apos;m Familiar With</h1>

            {/* Programming Languages  */}

            <h3 className='text-xl'>Programming Languages</h3>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
            >
                {Programming_Languages.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))}
            </div>

            {/* WebDevelopment Frameworks */}

            <h3 className='text-xl'>Web Developement Technologies</h3>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
            >
                {WebDevelopment_Tech.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))}
            </div>

            {/* Database_Technologies */}

            <h3 className='text-xl'>Database Technologies</h3>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
            >
                {Database_Technologies.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))}
            </div>


            {/* DevOps & Deployment Tools */}
            <h3 className='text-xl'>DevOps & Deployment Tools</h3>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4"
            >
                {DevOps_Deployment_Tools.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))}
            </div>

        </div>
    )
}

export default page