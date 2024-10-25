'use client';

import React from 'react';
import { FileDown } from "lucide-react";
import Link from 'next/link';

const ResumeButton: React.FC = () => {
    return (
        <Link
            href="https://drive.google.com/file/d/16ebey3K6tIWcpgVi0Gc7zI3mYVpgdHxR/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-center hover:bg-white text-white hover:text-[#111111] px-3 py-1 rounded transition duration-300 mr-4 border border-white"
        >
            <FileDown size={18} className="mr-2" />
            Resume
        </Link>
    );
};

export default ResumeButton;