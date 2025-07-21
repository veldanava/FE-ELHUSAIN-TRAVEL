"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Package {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string;
  isActive: boolean;
}

export default function Catalogue() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch("/api/tour-packages?limit=6");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        setPackages(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackages();
  }, []);

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[20px] font-bold md:ml-20">
              Paket yang tersedia
            </h1>
            <h1 className="md:ml-20">
              Allah tidak memanggil orang - orang yang mampu tapi Allah
              memampukan orang - orang yang terpanggil untuk berkunjung ke
              Baitullah
            </h1>
          </div>
          <div>
            <Link href="/paket">
              <button className="btn btn-warning text-white hidden flex-none lg:block md:mr-20">
                Lihat Semua
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-3 p-4 lg:flex-row lg:items-stretch lg:flex-wrap">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="card w-96 bg-base-100 shadow-xl animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="card-body">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="card-actions justify-end mt-4">
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.id} className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <Image
                    src={
                      pkg.mainImageUrl ||
                      "/placeholder.svg?height=300&width=400&query=travel+package"
                    }
                    alt={pkg.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{pkg.title}</h2>
                  <p>{pkg.shortDescription}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold">
                      {formatPrice(pkg.price)}
                    </span>
                    <span className="badge badge-outline">{pkg.duration}</span>
                  </div>
                  <div className="card-actions justify-end mt-2">
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
            <div className="text-center py-8 w-full">
              <p className="text-lg text-gray-500">
                Belum ada paket wisata tersedia
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
