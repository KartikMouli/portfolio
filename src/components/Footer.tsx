import Link from "next/link";
import Socials from "./Socials";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between py-6 border-t border-gray-800 mt-12">
            <Socials />
            <section className="mt-8 sm:mt-0">
                <p className="text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()}{" "}
                    <Link className="text-gray-300 hover:underline" href="/">
                        kartik-portfolio
                    </Link>
                    {" | "}
                    <Link className="text-gray-300 hover:underline font-semibold" href="/privacy">
                        Privacy Policy
                    </Link>
                </p>
            </section>
        </footer>
    );
}
