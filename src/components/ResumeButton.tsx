'use client';

import React from 'react';
import { FileDown } from "lucide-react";
import Link from 'next/link';
import { Button } from './ui/button';

const ResumeButton: React.FC = () => {
    return (
        <Link
            href="https://drive.google.com/file/d/16ebey3K6tIWcpgVi0Gc7zI3mYVpgdHxR/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
        >

            <Button variant={'outline'} className='px-3 py-1'>
                <span >Resume</span>
                <FileDown size={22} className="ml-2" />
            </Button>
        </Link>
    );
};

export default ResumeButton;