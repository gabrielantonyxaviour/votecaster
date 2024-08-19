/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.imgur.com",
      "priv-cast-frames.vercel.app",
      "imagedelivery.net",
    ],
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      readline: false,
    };
    return config;
  },
};

export default nextConfig;
