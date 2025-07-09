"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { admin } = useAuth();
  const API_HOST = process.env.API_HOST || "http://localhost:3000/api";

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

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Gagal mengambil kategori");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryData) => {
    try {
      const response = await fetch(`$${API_HOST}/categories}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);

      toast.success("Kategori berhasil ditambahkan");

      return newCategory;
    } catch (error) {
      toast.error("Gagal menambahkan kategori");
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
    fetchCategories,
    createCategory,
  };
}
