"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GalleryImage {
  id: number;
  imageUrl: string;
  title?: string;
}

export default function Photo() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/gallery?limit=5");
        if (!response.ok) {
          throw new Error("Failed to fetch gallery");
        }
        const data = await response.json();
        setImages(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        // Fallback images if API fails
        setImages([
          { id: 1, imageUrl: "/placeholder.svg?height=180&width=180" },
          { id: 2, imageUrl: "/placeholder.svg?height=180&width=180" },
          { id: 3, imageUrl: "/placeholder.svg?height=180&width=180" },
          { id: 4, imageUrl: "/placeholder.svg?height=180&width=180" },
          { id: 5, imageUrl: "/placeholder.svg?height=180&width=180" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGallery();
  }, []);

  return (
    <div className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[20px] font-bold md:ml-20">Galeri Foto</h1>
          </div>
          <div>
            <Link href="/detail">
              <button className="btn btn-warning text-white hidden flex-none lg:block md:mr-20">
                Lihat Semua
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-3 p-4 lg:flex-row lg:items-stretch lg:flex-wrap">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[180px] h-[180px] bg-gray-200 animate-pulse rounded"
                ></div>
              ))
            : images.map((image) => (
                <figure key={image.id}>
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.title || "Gallery image"}
                    width={180}
                    height={180}
                    className="object-cover rounded"
                  />
                </figure>
              ))}
        </div>
      </div>
    </div>
  );
}
