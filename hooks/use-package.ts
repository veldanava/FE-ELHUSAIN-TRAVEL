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

// Tambahkan interface untuk opsi hook
interface UsePackagesOptions {
  forAdmin?: boolean;
  limit?: number;
  page?: number;
  isActive?: boolean;
  search?: string;
  categoryId?: string | number;
  sortBy?: string;
}

// Sesuaikan tanda tangan fungsi usePackages
export function usePackages(options?: UsePackagesOptions) {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  // --- QUERY UNTUK MENGAMBIL DAFTAR PAKET ---
  const {
    data: responseData, // Perubahan: ganti nama 'packages' menjadi 'responseData'
    isLoading,
    error,
    isRefetching,
  } = useQuery<PackagesResponse, Error>({
    // Perubahan: Tipe data sekarang PackagesResponse
    // Perubahan: queryKey sekarang mencakup semua opsi
    queryKey: ["tourPackages", options],
    queryFn: async () => {
      let headers: HeadersInit = {};
      if (options?.forAdmin && !admin?.token) {
        throw new Error("Admin token not available for admin operations.");
      }
      if (admin?.token) {
        headers = { Authorization: `Bearer ${admin.token}` };
      }

      // Perubahan: Bangun URL dengan semua parameter
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

      // Normalisasi harga tetap dilakukan
      result.data = (result.data || []).map((pkg) => ({
        ...pkg,
        price:
          typeof pkg.price === "string"
            ? Number.parseFloat(pkg.price)
            : pkg.price,
      }));

      return result;
    },
    enabled: options?.forAdmin ? !!admin?.token : true,
    staleTime: 1000 * 60 * 5,
    placeholderData: {
      // Perubahan: placeholder yang lebih baik
      message: "",
      data: [],
      meta: { page: 1, limit: 10, count: 0 },
    },
    // Perubahan: Hapus 'select' untuk sorting, karena sudah dilakukan di backend
  });

  // Efek samping untuk menampilkan error dari query
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // --- MUTASI UNTUK MEMBUAT PAKET ---
  const createPackageMutation = useMutation<
    TourPackage, // Tipe data yang dikembalikan onSuccess
    Error, // Tipe error
    CreatePackageData // Tipe argumen untuk mutationFn
  >({
    mutationFn: async (packageData) => {
      if (!admin?.token) throw new Error("Admin token not available.");
      const response = await fetch(`${API_HOST}/tour-packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan paket wisata");
      }
      const result = await response.json();
      const newPackage = result.data || result; // Sesuaikan jika API Anda mengembalikan data langsung

      return {
        ...newPackage,
        price:
          typeof newPackage.price === "string"
            ? Number.parseFloat(newPackage.price)
            : newPackage.price,
      };
    },
    onSuccess: () => {
      // Invalidate query untuk me-refetch daftar paket secara otomatis
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      toast.success("Paket wisata berhasil ditambahkan!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menambahkan paket wisata.");
    },
  });

  // --- MUTASI UNTUK MENGUPDATE PAKET ---
  const updatePackageMutation = useMutation<
    TourPackage, // Tipe data yang dikembalikan onSuccess
    Error, // Tipe error
    UpdatePackageData // Tipe argumen untuk mutationFn
  >({
    mutationFn: async (packageData) => {
      if (!admin?.token) throw new Error("Admin token not available.");
      const response = await fetch(
        `${API_HOST}/tour-packages/${packageData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
          body: JSON.stringify(packageData),
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
      };
    },
    onSuccess: (updatedPackage) => {
      // Invalidate query untuk me-refetch daftar paket
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      // Opsional: invalidasi query detail paket jika ada
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
      // Invalidate query untuk me-refetch daftar paket
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      toast.success("Paket wisata berhasil dihapus!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus paket wisata.");
    },
  });

  // --- MUTASI BARU UNTUK UPDATE MAINIMAGEURL ---
  const updateMainImageMutation = useMutation<
    TourPackage, // Tipe data yang dikembalikan onSuccess
    Error, // Tipe error
    { packageId: number; imageUrl: string } // Tipe argumen untuk mutationFn
  >({
    mutationFn: async ({ packageId, imageUrl }) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const response = await fetch(`${API_HOST}/tour-packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ mainImageUrl: imageUrl }), // Hanya kirim mainImageUrl
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
      };
    },
    onSuccess: (updatedPackage) => {
      // Invalidate atau update cache untuk `tourPackages`
      queryClient.invalidateQueries({ queryKey: ["tourPackages"] });
      // Invalidasi atau update cache untuk `tourPackage` detail (jika ada)
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
