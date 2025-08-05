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
        hostname: "31.97.158.33",
        port: "3000", // Port backend Anda
        pathname: "/api", // Atau lebih umum: /uploads/**
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Ganti dengan hostname yang sesuai
        port: "", // Biasanya kosong untuk https
        pathname: "/**", // Atau sesuai dengan path yang Anda butuhkan
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
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
