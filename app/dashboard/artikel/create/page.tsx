// app/dashboard/posts/create/page.tsx

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/post-form";
import {
  UpdatePostData,
  usePosts,
  type CreatePostData,
} from "@/hooks/use-article";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost, isCreating } = usePosts();

  const handleSubmit = async (data: CreatePostData | UpdatePostData) => {
    // Ensure required fields are present
    if (!data.title) {
      console.error("Title is required");
      return;
    }
    try {
      createPost({
        ...data,
        title: data.title as string, // ensure title is string
        slug: (data as CreatePostData).slug ?? "", // ensure slug is always a string
        body: data.body ?? "", // ensure body is always a string
        type: (data as CreatePostData).type ?? "BLOG", // ensure type is always defined
      });
      router.push("/dashboard/artikel");
    } catch (error) {
      // Error handled in hook (toast.error)
      console.error("Failed to create post:", error);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/artikel");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/artikel">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tambah Post</h1>
          <p className="text-muted-foreground">
            Buat post baru untuk blog, artikel, atau konten lainnya
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Post</CardTitle>
          <CardDescription>
            Lengkapi informasi di bawah untuk membuat post baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isCreating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
