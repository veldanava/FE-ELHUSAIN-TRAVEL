import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http", // Pastikan protokolnya sesuai (http atau https)
        hostname: "localhost",
        port: "3000", // Port backend Anda
        pathname: "/**", // Atau lebih umum: /uploads/**
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Ganti dengan hostname yang sesuai
        port: "", // Biasanya kosong untuk https
        pathname: "/**", // Atau sesuai dengan path yang Anda butuhkan
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
