/** @type {import('next').NextConfig} */
const nextConfig = {
  // env: {
  //   BASE_URL:
  //     process.env.NODE_ENV === "production"
  //       ? "https://university-backend-gold.vercel.app/api/teacher"
  //       : "http://localhost:8003/api/teacher",
  // },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // Add your Cloudinary domain here
  },
};

module.exports = nextConfig;
