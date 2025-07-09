"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

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
  const [images, setImages] = useState<PackageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { admin } = useAuth();
  const API_HOST = process.env.NEXT_PUBLIC_API_HOST || ""; // Assign your API host here

  const fetchImages = async (pkgId: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_HOST}/tour-packages/${pkgId}/images`,
        {
          headers: {
            Authorization: `Bearer ${admin?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const result: ImagesResponse = await response.json();
      const imagesArray = Array.isArray(result.data) ? result.data : [];

      // Sort by display order
      const sortedImages = imagesArray.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      setImages(sortedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
      toast.error("Gagal memuat gambar");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (pkgId: number, file: File, displayOrder = 1) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("displayOrder", displayOrder.toString());

      const response = await fetch(`/api/tour-packages/${pkgId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const result: ImageResponse = await response.json();
      const uploadedImage = result.data;

      setImages((prev) =>
        [...prev, uploadedImage].sort((a, b) => a.displayOrder - b.displayOrder)
      );

      toast.success("Gambar berhasil diupload");

      return uploadedImage;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupload gambar"
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (pkgId: number, files: File[]) => {
    try {
      setIsUploading(true);
      const results: PackageImage[] = [];

      // Upload files sequentially to maintain order
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const displayOrder = images.length + i + 1;

        try {
          const result = await uploadImage(pkgId, file, displayOrder);
          results.push(result);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          // Continue with other files
        }
      }

      if (results.length > 0) {
        toast.success(`${results.length} gambar berhasil diupload`);
      }

      return results;
    } catch (error) {
      toast.error("Gagal mengupload beberapa gambar");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      setIsDeleting(imageId);

      const response = await fetch(`/api/tour-packages/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));

      toast.success("Gambar berhasil dihapus");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus gambar"
      );
      throw error;
    } finally {
      setIsDeleting(null);
    }
  };

  const updateImageOrder = async (imageId: number, newDisplayOrder: number) => {
    try {
      const response = await fetch(`/api/tour-packages/images/${imageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({ displayOrder: newDisplayOrder }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update image order");
      }

      const result: ImageResponse = await response.json();
      const updatedImage = result.data;

      setImages((prev) =>
        prev
          .map((img) => (img.id === imageId ? updatedImage : img))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );

      toast.success("Urutan gambar berhasil diupdate");

      return updatedImage;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengupdate urutan gambar"
      );
      throw error;
    }
  };

  useEffect(() => {
    if (packageId && admin?.token) {
      fetchImages(packageId);
    }
  }, [packageId, admin?.token]);

  return {
    images,
    isLoading,
    isUploading,
    isDeleting,
    fetchImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImageOrder,
  };
}
