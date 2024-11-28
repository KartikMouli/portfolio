import Link from "next/link";
import Socials from "./Socials";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between px-6 pt-6 border-t mt-12">
            <Socials />
            <section className="mt-8 sm:mt-0">
                <div className="text-center text-sm">
                    &copy; {new Date().getFullYear()}{" "}
                    <Link className="hover:underline" href="/">
                        kartik-portfolio
                    </Link>
                    {" | "}
                    <Link className="hover:underline font-semibold" href="/privacy">
                        Privacy Policy
                    </Link>
                </div>
            </section>
        </footer>
    );
}
