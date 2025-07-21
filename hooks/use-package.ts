/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/use-package.ts
"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "./use-categories"; // Pastikan path ini benar
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
  price: number; // Normalisasi ke number di sini karena kita akan memparsingnya
  duration: string;
  mainImageUrl: string | null; // Bisa null jika belum ada gambar utama
  categoryId: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category; // Menjamin Category terdefinisi
  images?: PackageImage[]; // Menjamin images terdefinisi
}

export interface CreatePackageData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string; // Saat membuat/mengupdate paket, ini akan kosong atau diambil dari form lain
  categoryId: number;
  isActive: boolean;
}

// UpdatePackageData sekarang hanya perlu id dan properti yang opsional untuk diupdate
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

export function usePackages() {
  const { admin } = useAuth();
  const queryClient = useQueryClient(); // Inisialisasi query client
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  // --- QUERY UNTUK MENGAMBIL DAFTAR PAKET ---
  const {
    data: packages,
    isLoading,
    error,
    isRefetching, // Untuk indikator refetching
  } = useQuery<TourPackage[], Error>({
    queryKey: ["tourPackages"], // Kunci unik untuk cache query ini
    queryFn: async () => {
      if (!admin?.token) {
        // Jika token admin tidak ada, kita bisa throw error atau return empty array
        // Untuk menghindari fetch yang tidak perlu atau error pada saat login belum lengkap
        return [];
      }
      const response = await fetch(`${API_HOST}/tour-packages`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil paket wisata");
      }
      const result: PackagesResponse = await response.json();

      // Normalisasi price ke number
      const normalizedPackages = (result.data || []).map((pkg) => ({
        ...pkg,
        price:
          typeof pkg.price === "string"
            ? Number.parseFloat(pkg.price)
            : pkg.price,
      }));
      return normalizedPackages;
    },
    enabled: !!admin?.token, // Query hanya akan dijalankan jika admin.token tersedia
    staleTime: 1000 * 60 * 5, // Data dianggap "stale" setelah 5 menit
    placeholderData: [], // Memberikan data awal kosong saat loading
    select: (data) =>
      data.sort((a, b) =>
        b.createdAt && a.createdAt
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : 0
      ), // Opsional: mengurutkan data berdasarkan createdAt secara descending
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
    onSuccess: (newPackage) => {
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
    onSuccess: (_, id) => {
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
    packages: packages || [], // Pastikan selalu mengembalikan array
    meta: {
      // Kembalikan meta data (jika Anda masih ingin menggunakannya untuk pagination di komponen lain)
      page: 1, // Jika tidak ada pagination di useQuery, set default
      limit: 10,
      count: packages?.length || 0,
    },
    isLoading: isLoading || isRefetching, // Gabungkan isLoading dan isRefetching
    isCreating: createPackageMutation.isPending,
    isUpdating: updatePackageMutation.isPending,
    isDeleting: deletePackageMutation.isPending
      ? deletePackageMutation.variables
      : null, // Mengidentifikasi ID yang sedang dihapus
    createPackage: createPackageMutation.mutateAsync, // Menggunakan mutateAsync untuk await
    updatePackage: updatePackageMutation.mutateAsync,
    deletePackage: deletePackageMutation.mutateAsync,
    updateMainImage: updateMainImageMutation.mutateAsync, // Export mutasi baru
  };
}
