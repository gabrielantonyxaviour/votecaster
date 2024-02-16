/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.imgur.com"],
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
