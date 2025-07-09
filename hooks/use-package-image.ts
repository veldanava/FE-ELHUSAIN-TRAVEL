"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface PackageImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  packageId: number;
}

export function usePackageImages() {
  const [isUploading, setIsUploading] = useState(false);
  const { admin } = useAuth();
  const API_HOST = process.env.API_HOST || "http://localhost:3000/api";

  const uploadImage = async (
    packageId: number,
    file: File,
    displayOrder = 1
  ) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("displayOrder", displayOrder.toString());

      const response = await fetch(`/${API_HOST}/tour-packages/${packageId}/images`, {
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

      const uploadedImage = await response.json();

      toast.success("Gambar berhasil diupload");

      return uploadedImage;
    } catch (error) {
      toast.error("Gagal mengupload gambar");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (packageId: number, files: File[]) => {
    try {
      setIsUploading(true);
      const uploadPromises = files.map((file, index) =>
        uploadImage(packageId, file, index + 1)
      );

      const results = await Promise.all(uploadPromises);

      toast.success("Semua gambar berhasil diupload");

      return results;
    } catch (error) {
      toast.error("Gagal mengupload beberapa gambar");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadImage,
    uploadMultipleImages,
  };
}
