'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpDown, Clock, Calendar, Film, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SortOption {
    label: string;
    value: string;
    direction: 'asc' | 'desc';
    icon?: React.ReactNode;
}

interface SortFilterProps {
    options: SortOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const defaultOptions: SortOption[] = [
    { 
        label: 'Added Date (Newest)', 
        value: 'date-desc', 
        direction: 'desc',
        icon: <Clock className="w-3 h-3" />
    },
    { 
        label: 'Added Date (Oldest)', 
        value: 'date-asc', 
        direction: 'asc',
        icon: <Clock className="w-3 h-3" />
    },
    { 
        label: 'Release Year (Newest)', 
        value: 'year-desc', 
        direction: 'desc',
        icon: <CalendarDays className="w-3 h-3" />
    },
    { 
        label: 'Release Year (Oldest)', 
        value: 'year-asc', 
        direction: 'asc',
        icon: <CalendarDays className="w-3 h-3" />
    },
    { 
        label: 'Name (A-Z)', 
        value: 'title-asc', 
        direction: 'asc',
        icon: <Film className="w-3 h-3" />
    },
    { 
        label: 'Name (Z-A)', 
        value: 'title-desc', 
        direction: 'desc',
        icon: <Film className="w-3 h-3" />
    }
];

export function SortFilter({ 
    options = defaultOptions, 
    value = 'date-desc', 
    onChange, 
    className = '' 
}: SortFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div 
            className={cn(
                "relative group",
                className
            )} 
            ref={dropdownRef}
        >
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1.5",
                    "bg-background/80 hover:bg-background/90",
                    "border-border/50 hover:border-border",
                    "transition-all duration-200",
                    "active:scale-[0.98]",
                    "shadow-sm hover:shadow",
                    "backdrop-blur-sm"
                )}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label="Sort movies"
            >
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground/90 truncate max-w-[120px]">{selectedOption.label}</span>
                <ChevronDown 
                    className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        isOpen ? "rotate-180" : ""
                    )} 
                />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ 
                            duration: 0.15,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className={cn(
                            "absolute right-0 mt-1 w-48",
                            "rounded-md bg-background/95",
                            "border border-border/50",
                            "shadow-md backdrop-blur-sm",
                            "z-50 overflow-hidden"
                        )}
                        role="listbox"
                        aria-label="Sort options"
                    >
                        <div className="py-0.5">
                            {options.map((option) => (
                                <Button
                                    key={option.value}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full justify-start px-3 py-1.5 text-xs",
                                        "hover:bg-background/80",
                                        "focus:bg-background/80",
                                        value === option.value && "bg-background/80 font-medium"
                                    )}
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {option.icon}
                                        <span className="text-foreground/90 truncate">{option.label}</span>
                                        {value === option.value && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="w-1 h-1 rounded-full bg-primary ml-auto"
                                            />
                                        )}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 