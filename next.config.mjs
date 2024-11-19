/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'github-readme-streak-stats.herokuapp.com',
            'leetcard.jacoblin.cool',
            'cdn.svgator.com',
            'raw.githubusercontent.com',
            'holopin.me'
        ],
        dangerouslyAllowSVG: true, // Allow SVG images

    },
    transpilePackages: ['lucide-react'] // add this
};

export default nextConfig;
