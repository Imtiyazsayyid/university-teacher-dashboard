/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://regift-backend.vercel.app/api/teacher"
        : "http://localhost:8003/api/teacher",
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
