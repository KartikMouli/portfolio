'use client';

import React from 'react';
import { FileDown } from "lucide-react";

const ResumeButton: React.FC = () => {
    return (
        <a
            href="https://drive.google.com/file/d/16ebey3K6tIWcpgVi0Gc7zI3mYVpgdHxR/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-center bg-[#111111] hover:bg-white text-white hover:text-[#111111] px-3 py-1 rounded transition duration-300 mr-4 border border-white"
        >
            <FileDown size={18} className="mr-2" />
            Resume
        </a>
    );
};

export default ResumeButton;