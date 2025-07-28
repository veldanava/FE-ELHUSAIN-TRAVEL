"use client";

import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export interface Post {
  id: number;
  adminId: number;
  type: "BLOG" | "CATALOG" | "NEWS" | "INFORMATION";
  title: string;
  slug: string;
  body: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  publishedAt: string | null;
  imageUrls: string[];
}

export interface CreatePostData {
  title: string;
  slug: string;
  body: string;
  type: "BLOG" | "CATALOG" | "NEWS" | "INFORMATION";
  status?: "DRAFT" | "PUBLISHED";
  images?: File[];
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  body?: string;
  type?: "BLOG" | "CATALOG" | "NEWS" | "INFORMATION";
  status?: "DRAFT" | "PUBLISHED";
  images?: File[];
}

export interface PostsResponse {
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    count: number;
  };
  posts: Post[];
}

export interface PostResponse {
  success: boolean;
  message?: string;
  post: Post;
}

// Interface untuk opsi hook
interface UsePostsOptions {
  forAdmin?: boolean;
  limit?: number;
  page?: number;
  type?: string;
  status?: string;
  search?: string;
  sortBy?: string;
}

// Setup axios instance
const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_HOST,
});

// Axios interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Terjadi kesalahan";
    return Promise.reject(new Error(message));
  }
);

export function usePosts(options?: UsePostsOptions) {
  const { admin } = useAuth();
  const queryClient = useQueryClient();

  // --- QUERY UNTUK MENGAMBIL DAFTAR POSTS ---
  const {
    data: responseData,
    isLoading,
    error,
    isRefetching,
  } = useQuery<PostsResponse, Error>({
    queryKey: ["posts", options],
    queryFn: async () => {
      const headers: Record<string, string> = {};

      if (options?.forAdmin && !admin?.token) {
        throw new Error("Admin token not available for admin operations.");
      }

      if (admin?.token) {
        headers.Authorization = `Bearer ${admin.token}`;
      }

      // Build URL dengan semua parameter
      const params = new URLSearchParams();
      if (options?.limit) params.append("limit", options.limit.toString());
      if (options?.page) params.append("page", options.page.toString());
      if (options?.type && options.type !== "all") {
        params.append("type", options.type);
      }
      if (options?.status && options.status !== "all") {
        params.append("status", options.status);
      }
      if (options?.search) params.append("search", options.search);
      if (options?.sortBy) params.append("sort", options.sortBy);

      const queryString = params.toString();
      const url = `/posts${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<PostsResponse>(url, { headers });

      return response.data;
    },
    enabled: options?.forAdmin ? !!admin?.token : true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: {
      success: true,
      posts: [],
      meta: { page: 1, limit: 10, count: 0 },
    },
  });

  // Efek samping untuk menampilkan error dari query
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // --- MUTASI UNTUK MEMBUAT POST ---
  const createPostMutation = useMutation<Post, Error, CreatePostData>({
    mutationFn: async (postData) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("slug", postData.slug);
      formData.append("body", postData.body);
      formData.append("type", postData.type);
      formData.append("status", postData.status || "DRAFT");

      // Add images if provided
      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await apiClient.post<PostResponse>("/posts", formData, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post berhasil dibuat!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal membuat post.");
    },
  });

  // --- MUTASI UNTUK UPDATE POST ---
  const updatePostMutation = useMutation<
    Post,
    Error,
    { id: number; data: UpdatePostData }
  >({
    mutationFn: async ({ id, data: postData }) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      const formData = new FormData();

      if (postData.title) formData.append("title", postData.title);
      if (postData.slug) formData.append("slug", postData.slug);
      if (postData.body) formData.append("body", postData.body);
      if (postData.type) formData.append("type", postData.type);
      if (postData.status) formData.append("status", postData.status);

      // Add images if provided
      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await apiClient.put<PostResponse>(
        `/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal memperbarui post.");
    },
  });

  // --- MUTASI UNTUK DELETE POST ---
  const deletePostMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (!admin?.token) throw new Error("Admin token not available.");

      await apiClient.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post berhasil dihapus!");
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus post.");
    },
  });

  return {
    // Data
    posts: responseData?.posts || [],
    meta: responseData?.meta,

    // Loading states
    isLoading,
    isRefetching,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,

    // Actions
    createPost: createPostMutation.mutate,
    updatePost: (id: number, data: UpdatePostData) =>
      updatePostMutation.mutate({ id, data }),
    deletePost: deletePostMutation.mutate,

    // Manual refetch
    refetch: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  };
}

// Hook untuk single post
export function usePost(id: number) {
  const { admin } = useAuth();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post, Error>({
    queryKey: ["post", id],
    queryFn: async () => {
      const headers: Record<string, string> = {};

      if (admin?.token) {
        headers.Authorization = `Bearer ${admin.token}`;
      }

      const response = await apiClient.get<PostResponse>(`/posts/${id}`, {
        headers,
      });

      return response.data.post;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Efek samping untuk menampilkan error dari query
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    post: post || null,
    isLoading,
    refetch: () => {
      // Manual refetch bisa dilakukan dengan queryClient jika diperlukan
    },
  };
}
