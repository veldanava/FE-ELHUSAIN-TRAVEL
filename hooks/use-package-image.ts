// hooks/use-package-images.ts
"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface PackageImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  packageId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImagesResponse {
  message: string;
  data: PackageImage[];
}

export interface ImageResponse {
  message: string;
  data: PackageImage;
}

export function usePackageImages(packageId?: number) {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api"; // Pastikan ini benar

  // --- QUERY: Mengambil semua gambar untuk suatu paket ---
  const {
    data: images,
    isLoading,
    refetch: fetchImages, // Ganti fetchImages manual dengan refetch
  } = useQuery<PackageImage[], Error>({
    queryKey: ["packageImages", packageId], // Kunci query termasuk packageId
    queryFn: async () => {
      if (!packageId) throw new Error("Package ID is required.");
      if (!admin?.token) throw new Error("Admin token not available.");

      const response = await fetch(
        `${API_HOST}/tour-packages/${packageId}/images`,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch images");
      }

      const result: ImagesResponse = await response.json();
      const imagesArray = Array.isArray(result.data) ? result.data : [];
      // Sort by display order
      return imagesArray.sort((a, b) => a.displayOrder - b.displayOrder);
    },
    enabled: !!packageId && !!admin?.token, // Hanya jalankan query jika packageId dan token ada
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
    // Error handling should be done inside queryFn or outside the hook
  });

  // --- MUTATION: Mengupload satu gambar ---
  const uploadImageMutation = useMutation<
    PackageImage, // Tipe data yang dikembalikan onSuccess
    Error, // Tipe error
    { pkgId: number; file: File } // Perhatikan: `displayOrder` dihapus dari argumen
  >({
    mutationFn: async ({ pkgId, file }) => {
      // Perhatikan: `displayOrder` dihapus dari argumen
      if (!admin?.token) throw new Error("Admin token not available.");

      const formData = new FormData();
      formData.append("image", file);
      // formData.append("displayOrder", displayOrder.toString()); // BARIS INI DIHAPUS

      const response = await fetch(
        `${API_HOST}/tour-packages/${pkgId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const result: ImageResponse = await response.json();
      return result.data;
    },
    onSuccess: (newImage, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["packageImages", variables.pkgId],
      });
      toast.success("Gambar berhasil diupload");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengupload gambar");
    },
  });

  // --- MUTATION: Mengupload banyak gambar ---
  const uploadMultipleImagesMutation = useMutation<
    PackageImage[], // Tipe data yang dikembalikan onSuccess
    Error, // Tipe error
    { pkgId: number; files: File[] } // Tipe argumen untuk mutationFn
  >({
    mutationFn: async ({ pkgId, files }) => {
      const results: PackageImage[] = [];
      for (const file of files) {
        // Loop lebih sederhana
        try {
          // Tidak perlu mengirim displayOrder karena backend menanganinya
          const result = await uploadImageMutation.mutateAsync({ pkgId, file }); // `file` adalah satu-satunya argumen baru
          results.push(result);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          // Biarkan loop berlanjut, error individu akan ditangani oleh onError di uploadImageMutation
        }
      }
      return results;
    },
    onSuccess: (results, variables) => {
      if (results.length > 0) {
        toast.success(`${results.length} gambar berhasil diupload`);
      }
      queryClient.invalidateQueries({
        queryKey: ["packageImages", variables.pkgId],
      });
    },
    onError: (err) => {
      toast.error("Gagal mengupload beberapa gambar: " + err.message);
    },
  });

  // --- MUTATION: Menghapus gambar ---
  const deleteImageMutation = useMutation<
    void, // Tidak ada data kembali dari delete
    Error,
    number // ID gambar yang akan dihapus
  >({
    mutationFn: async (imageId) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const response = await fetch(
        `${API_HOST}/tour-packages/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }
    },
    onSuccess: (_, imageId) => {
      queryClient.setQueryData<PackageImage[]>(
        ["packageImages", packageId],
        (oldImages) =>
          oldImages ? oldImages.filter((img) => img.id !== imageId) : []
      );
      toast.success("Gambar berhasil dihapus");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus gambar");
    },
  });

  // --- MUTATION: Mengupdate urutan gambar ---
  const updateImageOrderMutation = useMutation<
    PackageImage, // Tipe data yang dikembalikan onSuccess
    Error,
    { imageId: number; newDisplayOrder: number } // Tipe argumen untuk mutationFn
  >({
    mutationFn: async ({ imageId, newDisplayOrder }) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const response = await fetch(
        `${API_HOST}/tour-packages/images/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
          body: JSON.stringify({ displayOrder: newDisplayOrder }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update image order");
      }

      const result: ImageResponse = await response.json();
      return result.data;
    },
    onSuccess: (updatedImage) => {
      queryClient.setQueryData<PackageImage[]>(
        ["packageImages", updatedImage.packageId],
        (oldImages) => {
          if (!oldImages) return [];
          const newImages = oldImages
            .map((img) => (img.id === updatedImage.id ? updatedImage : img))
            .sort((a, b) => a.displayOrder - b.displayOrder);
          return newImages;
        }
      );
      toast.success("Urutan gambar berhasil diupdate");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengupdate urutan gambar");
    },
  });

  return {
    images: images || [], // Pastikan selalu array
    isLoading: isLoading, // Loading state dari useQuery
    isUploading:
      uploadImageMutation.isPending || uploadMultipleImagesMutation.isPending,
    isDeleting: deleteImageMutation.isPending
      ? deleteImageMutation.variables
      : null,
    fetchImages, // Ini adalah refetch dari useQuery
    uploadImage: uploadImageMutation.mutateAsync,
    uploadMultipleImages: uploadMultipleImagesMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    updateImageOrder: updateImageOrderMutation.mutateAsync,
  };
}
