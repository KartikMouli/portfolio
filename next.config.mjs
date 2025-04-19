/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github-readme-streak-stats.herokuapp.com',
            },
            {
                protocol: 'https',
                hostname: 'leetcard.jacoblin.cool',
            },
            {
                protocol: 'https',
                hostname: 'cdn.svgator.com',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'holopin.me',
            }
        ],
        dangerouslyAllowSVG: true, // Allow SVG images
    },
    transpilePackages: ['lucide-react'] // add this
};

export default nextConfig;
