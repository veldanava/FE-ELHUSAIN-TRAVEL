// components/catalogue.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
// Import hook usePackages dari file hooks/use-package Anda
import { usePackages } from "@/hooks/use-package";
// Definisikan base URL untuk gambar dari backend Anda
// Pastikan NEXT_PUBLIC_STORAGE_URL diatur di file .env.local Anda
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000"; // Sesuaikan dengan port backend Anda

export default function Catalogue() {
  // Gunakan hook usePackages untuk mendapatkan data paket
  // Panggil tanpa forAdmin: true agar tidak memerlukan token
  // Tambahkan isActive: true untuk hanya menampilkan paket yang aktif
  // Tambahkan limit: 6 sesuai kebutuhan Anda
  const { packages, isLoading } = usePackages({ limit: 6, isActive: true });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:px-20">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
              Paket yang tersedia
            </h1>
            <p className="text-base text-gray-700 mt-2">
              Allah tidak memanggil orang - orang yang mampu tapi Allah
              memampukan orang - orang yang terpanggil untuk berkunjung ke
              Baitullah
            </p>
          </div>
          <div className="self-end md:self-auto">
            <Link href="/paket">
              <button className="btn btn-warning text-white whitespace-nowrap">
                Lihat Semua Paket
              </button>
            </Link>
          </div>
        </div>

        {/* Grid responsif untuk daftar paket */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-20">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl animate-pulse flex flex-col h-full"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl w-full"></div>
                <div className="card-body p-4 flex-grow">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="card-actions justify-end mt-auto">
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="card bg-base-100 shadow-xl flex flex-col h-full"
              >
                <figure className="relative w-full h-48">
                  <Image
                    src={
                      pkg.mainImageUrl &&
                      typeof pkg.mainImageUrl === "string" &&
                      pkg.mainImageUrl.trim() !== ""
                        ? `${IMAGE_BASE_URL}${
                            pkg.mainImageUrl.startsWith("/")
                              ? pkg.mainImageUrl
                              : `/${pkg.mainImageUrl}`
                          }`
                        : "/images/placeholder.jpg" // Fallback image jika mainImageUrl tidak valid atau kosong
                    }
                    alt={pkg.title || "Paket Wisata"}
                    fill
                    className="object-cover rounded-t-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </figure>
                <div className="card-body p-4 flex-grow">
                  <h2 className="card-title text-xl font-semibold mb-2">
                    {pkg.title}
                  </h2>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {pkg.shortDescription}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-amber-800">
                      {formatPrice(pkg.price)}
                    </span>
                    <span className="badge badge-outline text-amber-800 border-amber-800">
                      {pkg.duration}
                    </span>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/paket/${pkg.id}`}>
                      <button className="btn btn-warning text-white">
                        Lihat Detail
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full col-span-full">
              <p className="text-lg text-gray-500">
                Belum ada paket wisata tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
