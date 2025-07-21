// hooks/use-admins.ts
"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Interfaces tetap sama ---
export interface AdminUser {
  id: number;
  email: string;
  role: string;
  createdAt?: string;
}

export interface CreateAdminUserData {
  email: string;
  password: string;
  role: string;
}

export interface UpdateAdminUserData {
  email?: string;
  role?: string;
  password?: string;
}

export interface AdminUsersResponse {
  message: string;
  admins: AdminUser[];
}

export interface AdminUserResponse {
  message: string;
  admins: AdminUser; // Pastikan ini 'admins' bukan 'data'
}
// --- End Interfaces ---

export function useAdmins() {
  const { admin } = useAuth();
  const queryClient = useQueryClient(); // Dapatkan instance query client
  const API_HOST =
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

  // --- Fungsi Fetching (untuk useQuery) ---
  const fetchAllAdmins = async (): Promise<AdminUser[]> => {
    if (!admin?.token) {
      throw new Error("Admin token not available.");
    }
    const response = await fetch(`${API_HOST}/admin`, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch admin users");
    }
    const result: AdminUsersResponse = await response.json();
    return Array.isArray(result.admins) ? result.admins : [];
  };

  // --- useQuery untuk mengambil daftar admin ---
  const {
    data: users,
    isLoading,
    error,
    refetch: fetchAdmins, // Ganti fetchAdmins manual dengan refetch dari useQuery
  } = useQuery<AdminUser[], Error>({
    queryKey: ["admins"], // Kunci unik untuk query ini
    queryFn: fetchAllAdmins,
    enabled: !!admin?.token, // Query hanya berjalan jika admin?.token ada
    staleTime: 1000 * 60 * 5, // Data dianggap "stale" setelah 5 menit
  });

  // Handle error from useQuery
  if (error) {
    toast.error(error.message || "Gagal mengambil admin");
  }

  // --- useMutation untuk membuat admin baru ---
  const createAdminMutation = useMutation<
    AdminUser,
    Error,
    CreateAdminUserData
  >({
    mutationFn: async (userData) => {
      if (!admin?.token) {
        throw new Error("Admin token not available.");
      }
      const response = await fetch(`${API_HOST}/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create admin user");
      }
      const result: AdminUserResponse = await response.json();
      return result.admins; // Pastikan ini 'admins'
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // Invalidasi cache admins
      toast.success("Admin user berhasil ditambahkan");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menambahkan admin user");
    },
  });

  // --- useMutation untuk memperbarui admin ---
  const updateAdminMutation = useMutation<
    AdminUser,
    Error,
    { id: number; data: UpdateAdminUserData }
  >({
    mutationFn: async ({ id, data }) => {
      if (!admin?.token) {
        throw new Error("Admin token not available.");
      }
      const response = await fetch(`${API_HOST}/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update admin user");
      }
      const result: AdminUserResponse = await response.json();
      return result.admins; // Pastikan ini 'admins'
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // Invalidasi cache admins
      toast.success("Admin user berhasil diupdate");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal mengupdate admin user");
    },
  });

  // --- useMutation untuk menghapus admin ---
  const deleteAdminMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (!admin?.token) {
        throw new Error("Admin token not available.");
      }
      const response = await fetch(`${API_HOST}/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete admin user");
      }
      // Tidak ada data kembali dari delete, cukup status OK
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // Invalidasi cache admins
      toast.success("Admin user berhasil dihapus");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus admin user");
    },
  });

  // --- getAdminById juga bisa menggunakan useQuery, tapi jika hanya untuk sekali pakai, fetch biasa tidak masalah ---
  // Untuk konsistensi, bisa diubah juga:
  const getAdminById = async (id: number): Promise<AdminUser | null> => {
    try {
      if (!admin?.token) {
        toast.error("Admin token not available for fetching single user.");
        return null;
      }
      const response = await fetch(`${API_HOST}/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin user");
      }

      const result: AdminUserResponse = await response.json();
      return result.admins;
    } catch (error) {
      console.error("Error fetching admin user:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat data admin user"
      );
      return null;
    }
  };

  return {
    users: users || [], // Pastikan selalu array
    isLoading,
    isCreating: createAdminMutation.isPending,
    isUpdating: updateAdminMutation.isPending,
    isDeleting: deleteAdminMutation.isPending
      ? deleteAdminMutation.variables
      : null, // Mengembalikan ID yang sedang dihapus
    fetchAdmins, // Ini sekarang adalah refetch dari useQuery
    createAdmin: createAdminMutation.mutateAsync, // Gunakan mutateAsync untuk async/await
    updateAdmin: updateAdminMutation.mutateAsync, // Gunakan mutateAsync
    deleteAdmin: deleteAdminMutation.mutateAsync, // Gunakan mutateAsync
    getAdminById,
  };
}
