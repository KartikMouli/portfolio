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
                        className="hover:cursor-pointer"
                    >
                        {resolvedTheme === "dark" ? (
                            <SunIcon className="size-5 text-orange-300" />
                        ) : (
                            <MoonIcon className="size-5" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border mt-1 text-popover-foreground">
                    <p>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}