// hooks/use-package.ts
"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "./use-categories";
import { useEffect } from "react";

export interface PackageImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  packageId: number;
}

export interface TourPackage {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string | null;
  categoryId: number;
  isActive: boolean;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  images?: PackageImage[];
}

export interface CreatePackageData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string;
  categoryId: number;
  isActive: boolean;
  features?: string[];
}

export interface UpdatePackageData extends Partial<CreatePackageData> {
  id: number;
}

export interface PackagesResponse {
  message: string;
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  data: TourPackage[];
}

interface UsePackagesOptions {
  forAdmin?: boolean;
  limit?: number;
  page?: number;
  isActive?: boolean;
  search?: string;
  categoryId?: string | number;
  sortBy?: string;
}

export function usePackages(options?: UsePackagesOptions) {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  // --- QUERY UNTUK MENGAMBIL DAFTAR PAKET ---
  const {
    data: responseData,
    isLoading,
    error,
    isRefetching,
  } = useQuery<PackagesResponse, Error>({
    queryKey: ["tourPackages", options],
    queryFn: async () => {
      let headers: HeadersInit = {};
      if (options?.forAdmin && !admin?.token) {
        throw new Error("Admin token not available for admin operations.");
      }
      if (admin?.token) {
        headers = { Authorization: `Bearer ${admin.token}` };
      }

      const params = new URLSearchParams();
      if (options?.limit) params.append("limit", options.limit.toString());
      if (options?.page) params.append("page", options.page.toString());
      if (typeof options?.isActive === "boolean") {
        params.append("isActive", options.isActive.toString());
      }
      if (options?.search) params.append("search", options.search);
      if (options?.categoryId && options.categoryId !== "all") {
        params.append("category", options.categoryId.toString());
      }
      if (options?.sortBy) params.append("sort", options.sortBy);

      const queryString = params.toString();
      const url = `${API_HOST}/tour-packages${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil paket wisata");
      }
      const result: PackagesResponse = await response.json();

      // Normalisasi data
      result.data = (result.data || []).map((pkg) => ({
        ...pkg,
        price:
          typeof pkg.price === "string"
            ? Number.parseFloat(pkg.price)
            : pkg.price,
        // Pastikan features selalu array
        features: Array.isArray(pkg.features) ? pkg.features : [],
      }));

      return result;
    },
    enabled: options?.forAdmin ? !!admin?.token : true,
    staleTime: 1000 * 60 * 5,
    placeholderData: {
      message: "",
      data: [],
      meta: { page: 1, limit: 10, count: 0 },
    },
  });

  // Efek samping untuk menampilkan error dari query
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // --- MUTASI UNTUK MEMBUAT PAKET ---
  const createPackageMutation = useMutation<
    TourPackage,
    Error,
    CreatePackageData
  >({
    mutationFn: async (packageData) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      // Pastikan features dikirim sebagai array
      const dataToSend = {
        ...packageData,
        features: packageData.features || [],
      };

      const response = await fetch(`${API_HOST}/tour-packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan paket wisata");
      }
      const result = await response.json();
      const newPackage = result.data || result;

      return {
        ...newPackage,
        price:
          typeof newPackage.price === "string"
            ? Number.parseFloat(newPackage.price)
            : newPackage.price,
        features: Array.isArray(newPackage.features) ? newPackage.features : [],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      toast.success("Paket wisata berhasil ditambahkan!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menambahkan paket wisata.");
    },
  });

  // --- MUTASI UNTUK MENGUPDATE PAKET ---
  const updatePackageMutation = useMutation<
    TourPackage,
    Error,
    UpdatePackageData
  >({
    mutationFn: async (packageData) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      // Pastikan features dikirim sebagai array jika ada
      const dataToSend = {
        ...packageData,
        features: packageData.features || [],
      };

      const response = await fetch(
        `${API_HOST}/tour-packages/${packageData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengupdate paket wisata");
      }
      const result = await response.json();
      const updatedPackage = result.data || result;

      return {
        ...updatedPackage,
        price:
          typeof updatedPackage.price === "string"
            ? Number.parseFloat(updatedPackage.price)
            : updatedPackage.price,
        features: Array.isArray(updatedPackage.features)
          ? updatedPackage.features
          : [],
      };
    },
    onSuccess: (updatedPackage) => {
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      queryClient.invalidateQueries({
        queryKey: ["tourPackage", updatedPackage.id],
      });
      toast.success("Paket wisata berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengupdate paket wisata.");
    },
  });

  // --- MUTASI UNTUK MENGHAPUS PAKET ---
  const deletePackageMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (!admin?.token) throw new Error("Admin token not available.");
      const response = await fetch(`${API_HOST}/tour-packages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus paket wisata");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      toast.success("Paket wisata berhasil dihapus!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus paket wisata.");
    },
  });

  // --- MUTASI UNTUK UPDATE MAINIMAGEURL ---
  const updateMainImageMutation = useMutation<
    TourPackage,
    Error,
    { packageId: number; imageUrl: string }
  >({
    mutationFn: async ({ packageId, imageUrl }) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const response = await fetch(`${API_HOST}/tour-packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ mainImageUrl: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui gambar utama");
      }

      const result = await response.json();
      const updatedPackage = result.data || result;

      return {
        ...updatedPackage,
        price:
          typeof updatedPackage.price === "string"
            ? Number.parseFloat(updatedPackage.price)
            : updatedPackage.price,
        features: Array.isArray(updatedPackage.features)
          ? updatedPackage.features
          : [],
      };
    },
    onSuccess: (updatedPackage) => {
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      queryClient.invalidateQueries({
        queryKey: ["tourPackage", updatedPackage.id],
      });
      toast.success("Gambar utama berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal memperbarui gambar utama.");
    },
  });

  return {
    packages: responseData?.data || [],
    meta: responseData?.meta,
    isLoading: isLoading || isRefetching,
    isCreating: createPackageMutation.isPending,
    isUpdating: updatePackageMutation.isPending,
    isDeleting: deletePackageMutation.isPending
      ? deletePackageMutation.variables
      : null,
    createPackage: createPackageMutation.mutateAsync,
    updatePackage: updatePackageMutation.mutateAsync,
    deletePackage: deletePackageMutation.mutateAsync,
    updateMainImage: updateMainImageMutation.mutateAsync,
  };
}
