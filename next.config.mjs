/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'github-readme-streak-stats.herokuapp.com',
            'leetcard.jacoblin.cool',
        ],
        dangerouslyAllowSVG: true, // Allow SVG images

    },
    transpilePackages: ['lucide-react'] // add this
};

export default nextConfig;
