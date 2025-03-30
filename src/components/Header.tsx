"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Projects",
        href: "/projects",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

const linkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
};

export default function Header() {
    const pathname = usePathname(); // Get the current pathname

    return (
        <motion.header
            className="sticky top-0 z-50 py-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <nav className="flex items-center justify-between">
                {/* Navigation Links */}
                <motion.ul
                    className="flex gap-4 sm:gap-8"
                    initial="initial"
                    animate="animate"
                >
                    {navLinks.map((nav, id) => (
                        <motion.li
                            key={id}
                            className={`link ${pathname === nav.href ? "dark:text-white font-bold" : ""
                                }`}
                            variants={linkVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Link href={nav.href}>{nav.name}</Link>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Theme Toggle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <ThemeToggle />
                </motion.div>
            </nav>
        </motion.header>
    );
}
