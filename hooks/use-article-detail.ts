import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Types
interface Post {
  id: number;
  adminId: number;
  type: string;
  title: string;
  slug: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  publishedAt: string | null;
  imageUrls: string[];
}

interface PostResponse {
  success: boolean;
  post: Post;
}

// Axios instance (optional - untuk konfigurasi global)
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

// API function
const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get<PostResponse>(`/posts/slug/${slug}`);

  if (!data.success || !data.post) {
    throw new Error("Post not found");
  }

  return data.post;
};

// Custom hook
export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", "slug", slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: !!slug, // Only run query if slug exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Alternative hook with error handling
export const usePostBySlugWithError = (slug: string) => {
  return useQuery({
    queryKey: ["post", "slug", slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    throwOnError: false, // Handle errors in component
  });
};
