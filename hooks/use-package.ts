"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { Category } from "./use-categories";

export interface TourPackage {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string;
  categoryId: number;
  isActive: boolean;
  category?: Category;
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

export function usePackages() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { admin } = useAuth();
  const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_HOST}/api/tour-packages`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const data = await response.json();
      setPackages(data);
    } catch (error) {
      toast.error("Gagal mengambil paket wisata");
      console.error("Error fetching packages:", error);
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

      const newPackage = await response.json();
      setPackages((prev) => [newPackage, ...prev]);

      toast.success("Paket wisata berhasil ditambahkan");

      return newPackage;
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

      const updatedPackage = await response.json();
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === packageData.id ? updatedPackage : pkg))
      );

      toast.success("Paket wisata berhasil diupdate");

      return updatedPackage;
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
      const response = await fetch(`${packages}/tour-packages/${id}`, {
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
