"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="link"
                        onClick={() => {
                            setTheme(resolvedTheme === "dark" ? "light" : "dark");
                        }}
                        className="hover:cursor-pointer relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={resolvedTheme}
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                exit={{ rotate: 180, scale: 0 }}
                                transition={{ duration: 0.3, type: "spring" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                {resolvedTheme === "dark" ? (
                                    <SunIcon className="size-5 text-orange-300" />
                                ) : (
                                    <MoonIcon className="size-5" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border mt-1 text-popover-foreground">
                    <p>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}