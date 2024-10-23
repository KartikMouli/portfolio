import Projects from '@/components/Projects'
import React from 'react'



function page() {
    return (
        <>
            <div className="mt-8 flex flex-col gap-8 pb-16">
                <h1 className="text-3xl font-bold">My projects</h1>
                <Projects />
            </div>
        </>
    )
}

export default page