import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <article className="flex flex-col gap-8 pb-16">
            <div className="min-h-full px-4 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                <div className="mx-auto max-w-max">
                    <section className="sm:flex">
                        <p className="title text-muted-foreground">404</p>
                        <div className="sm:ml-6">
                            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                                <h1 className="title sm:text-5xl">
                                    Oops! We Can&apos;t Find That Page!
                                </h1>
                                <object
                                    type="image/svg+xml"
                                    data="https://cdn.svgator.com/images/2022/01/404-svg-animation.svg"
                                    title="Kitty Yarn Play 404 page animation - Made by SVGator"
                                    style={{ width: "400px", height: "250px" ,margin:"15px"}}
                                >
                                    {/* Fallback for browsers that do not support object tags */}
                                    <img
                                        src="https://cdn.svgator.com/images/2022/01/404-svg-animation.svg"
                                        alt="Kitty Yarn Play 404 page animation - Made by SVGator"
                                        style={{ width: "100%", height: "auto" ,margin:"15px"}}
                                    />
                                </object>
                                <p className="mt-2 text-base text-muted-foreground">
                                    Looks like that page is off on an adventure without us. Don&apos;t worry; it happens to the best of us!
                                </p>
                                <p className="mt-4 text-gray-400">
                                    Here are a few things you can do:
                                </p>
                                <ul className="list-disc pl-5 mt-2 text-gray-300">
                                    <li>
                                        <Link href="/" className="text-blue-500 underline hover:text-blue-300">
                                            Head back to the homepage
                                        </Link>
                                    </li>
                                    <li>
                                        Try searching for what you need in the search bar!
                                    </li>
                                    <li>
                                        Still lost? Feel free to <Link href="/contact" className="text-blue-500 underline hover:text-blue-300">contact me</Link>.
                                    </li>
                                </ul>
                                <p className="mt-4 text-gray-400">
                                    Thanks for your patience! I promise the rest of the site is much easier to navigate.
                                </p>
                            </div>
                            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                                <Link href="/" className="inline-flex items-center mt-2 text-blue-500 underline hover:text-blue-300">
                                    <ArrowLeftIcon className="size-5" /> Head back to the homepage
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </article>
    );
}
