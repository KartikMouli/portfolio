// Comma-separated LAN origins (read from `.env.local`) so devs can test
// on real phones over Wi-Fi without Next 16 blocking the requests as
// cross-origin. Each developer sets their own IP — the var is empty by
// default so nothing is shipped, and the `allowedDevOrigins` key is
// only emitted when at least one entry is present. See `.env.example`
// for the variable name + how to find your LAN IP.
const devOrigins = process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  ...(devOrigins?.length ? { allowedDevOrigins: devOrigins } : {}),
};

export default nextConfig;
