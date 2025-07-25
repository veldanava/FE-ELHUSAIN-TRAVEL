// hooks/use-package-detail.ts
"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import type { TourPackage } from "./use-package";

export interface PackageDetailResponse {
  message: string;
  data: TourPackage; // <--- CHANGE THIS: It's an array, even if it usually contains one item
}

export function usePackageDetail(packageId: number | string) {
  const { admin } = useAuth();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  const {
    data: packageDetail, // This 'packageDetail' will now correctly be of type TourPackage | undefined
    isLoading,
    error,
    refetch,
  } = useQuery<TourPackage, Error>({
    // <--- Keep this as TourPackage, because we'll extract the first item
    queryKey: ["tourPackage", packageId],
    queryFn: async () => {
      let headers: HeadersInit = {};

      if (admin?.token) {
        headers = { Authorization: `Bearer ${admin.token}` };
      }

      const response = await fetch(`${API_HOST}/tour-packages/${packageId}`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil detail paket");
      }

      const result: PackageDetailResponse = await response.json();

      // --- IMPORTANT CHANGE HERE ---
      // Extract the first item from the data array
      const packageData = result.data;

      // If for some reason the array is empty, handle it
      if (!packageData) {
        throw new Error("Detail paket tidak ditemukan.");
      }
      // --- END IMPORTANT CHANGE ---

      // Normalize price
      return {
        ...packageData,
        price:
          typeof packageData.price === "string"
            ? Number.parseFloat(packageData.price)
            : packageData.price,
      };
    },
    enabled: !!packageId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  if (error) {
    toast.error(error.message);
  }

  return {
    packageDetail,
    isLoading,
    error,
    refetch,
  };
}
