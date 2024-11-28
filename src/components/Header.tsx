"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function Header() {
    const pathname = usePathname(); // Get the current pathname

    return (
        <header className="sticky top-0 z-50 py-6 backdrop-blur-sm">
            <nav className="flex items-center justify-between">
                <ul className="flex gap-4 sm:gap-8">
                    {navLinks.map((nav, id) => (
                        <li key={id} className={`link hover:font-semibold transition duration-200 ${pathname === nav.href ? "dark:text-white font-bold" : ""
                            }`}>
                            <Link href={nav.href}>{nav.name}</Link>

                        </li>
                    ))}
                </ul>
                <div className="flex gap-0 sm:gap-4">
                </div>
                <ThemeToggle/>
            </nav>
        </header>
    );
}