"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  message: string;
  data: Category;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { admin } = useAuth();
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_HOST}/categories`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result: CategoriesResponse = await response.json();

      // Handle the response structure - data is directly an array
      const categoriesArray = Array.isArray(result.data) ? result.data : [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Ensure categories remains an empty array on error
      setCategories([]);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengambil kategori"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryData) => {
    try {
      setIsCreating(true);

      const response = await fetch(`${API_HOST}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const result: CategoryResponse = await response.json();
      const newCategory = result.data;

      setCategories((prev) => [...prev, newCategory]);

      toast.success("Kategori berhasil ditambahkan");

      return newCategory;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan kategori"
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateCategory = async (
    id: number,
    categoryData: CreateCategoryData
  ) => {
    try {
      const response = await fetch(`${API_HOST}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const result: CategoryResponse = await response.json();
      const updatedCategory = result.data;

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );

      toast.success("Kategori berhasil diupdate");

      return updatedCategory;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate kategori"
      );
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`${API_HOST}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));

      toast.success("Kategori berhasil dihapus");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus kategori"
      );
      throw error;
    }
  };

  useEffect(() => {
    if (admin?.token) {
      fetchCategories();
    }
  }, [admin?.token]);

  return {
    categories,
    isLoading,
    isCreating,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
