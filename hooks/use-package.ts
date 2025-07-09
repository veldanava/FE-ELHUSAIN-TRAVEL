"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { Category } from "./use-categories";

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
  price: string | number; // API returns string, but we'll handle both
  duration: string;
  mainImageUrl: string;
  categoryId: number;
  isActive: boolean;
  category?: Category;
  images?: PackageImage[];
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdatePackageData extends CreatePackageData {
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
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { admin } = useAuth();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  const fetchPackages = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_HOST}/tour-packages?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${admin?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const result: PackagesResponse = await response.json();

      // Handle the nested response structure
      const packagesArray = Array.isArray(result.data) ? result.data : [];

      // Normalize price to number for internal use
      const normalizedPackages = packagesArray.map((pkg) => ({
        ...pkg,
        price:
          typeof pkg.price === "string"
            ? Number.parseFloat(pkg.price)
            : pkg.price,
      }));

      setPackages(normalizedPackages);
      setMeta(result.meta);
    } catch (error) {
      console.error("Error fetching packages:", error);
      // Ensure packages remains an empty array on error
      setPackages([]);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil paket wisata"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createPackage = async (packageData: CreatePackageData) => {
    try {
      setIsCreating(true);

      const response = await fetch(`${API_HOST}/tour-packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create package");
      }

      const result = await response.json();
      const newPackage = result.data || result;

      // Normalize price
      const normalizedPackage = {
        ...newPackage,
        price:
          typeof newPackage.price === "string"
            ? Number.parseFloat(newPackage.price)
            : newPackage.price,
      };

      setPackages((prev) => [normalizedPackage, ...prev]);
      setMeta((prev) => ({ ...prev, count: prev.count + 1 }));

      toast.success("Paket wisata berhasil ditambahkan");

      return normalizedPackage;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan paket wisata"
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updatePackage = async (packageData: UpdatePackageData) => {
    try {
      setIsUpdating(true);

      const response = await fetch(
        `${API_HOST}/tour-packages/${packageData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin?.token}`,
          },
          body: JSON.stringify(packageData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update package");
      }

      const result = await response.json();
      const updatedPackage = result.data || result;

      // Normalize price
      const normalizedPackage = {
        ...updatedPackage,
        price:
          typeof updatedPackage.price === "string"
            ? Number.parseFloat(updatedPackage.price)
            : updatedPackage.price,
      };

      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === packageData.id ? normalizedPackage : pkg))
      );

      toast.success("Paket wisata berhasil diupdate");

      return normalizedPackage;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate paket wisata"
      );
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePackage = async (id: number) => {
    try {
      setIsDeleting(id);

      const response = await fetch(`${API_HOST}/tour-packages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete package");
      }

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      setMeta((prev) => ({ ...prev, count: Math.max(0, prev.count - 1) }));

      toast.success("Paket wisata berhasil dihapus");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus paket wisata"
      );
      throw error;
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    if (admin?.token) {
      fetchPackages();
    }
  }, [admin?.token]);

  return {
    packages,
    meta,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
  };
}
