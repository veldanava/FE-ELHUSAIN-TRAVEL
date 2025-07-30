// app/dashboard/posts/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";;
import { PostForm } from "@/components/post-form";
import { usePosts, type Post, type UpdatePostData } from "@/hooks/use-article";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const { updatePost, isUpdating } = usePosts();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts/${postId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const result = await response.json();
        // Pastikan setPost menerima objek post, bukan wrapper
        setPost(result.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
        console.error("Error fetching post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (data: UpdatePostData) => {
    try {
      await updatePost(postId, data);
      router.push("/dashboard/artikel");
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/artikel");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* ... Skeleton seperti sebelumnya ... */}
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        {/* ... Error UI seperti sebelumnya ... */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ... Header seperti sebelumnya ... */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Post</CardTitle>
          <CardDescription>Update informasi post di bawah ini</CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm
            post={post}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
