"use client";

import { useParams, useRouter } from "next/navigation";
import PublicLayout from "@/components/public-layout";
import { usePosts } from "@/hooks/use-article";
import { usePostBySlug } from "@/hooks/use-article-detail"; // Import hook baru
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Share2, Heart, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [isLiked, setIsLiked] = useState(false);

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

  // Menggunakan custom hook untuk fetch post by slug
  const { data: post, isLoading, error, isError } = usePostBySlug(slug);

  // Get related posts
  const { posts: relatedPosts, isLoading: isLoadingRelated } = usePosts({
    status: "PUBLISHED",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.body.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PublicLayout>
        <PostDetailSkeleton />
      </PublicLayout>
    );
  }

  // Error state atau post tidak ditemukan
  if (isError || !post) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Artikel tidak ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              {error?.message ||
                "Artikel yang Anda cari tidak tersedia atau telah dihapus."}
            </p>
            <Button onClick={() => router.push("/artikel")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Artikel
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const relatedPostsFiltered =
    relatedPosts
      ?.filter((p) => p.id !== post.id && p.type === post.type)
      .slice(0, 3) || [];

  return (
    <PublicLayout>
      <div className="bg-gray-50">
        {/* Header Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="mb-6">
              <Badge className="bg-amber-800 text-white mb-4">
                {post.type}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Diupdate: {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="aspect-video relative bg-gray-200 rounded-lg overflow-hidden mb-8">
                <Image
                  src={
                    `${IMAGE_BASE_URL}${post.imageUrls[0]}` ||
                    "/placeholder.svg"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {post.body.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Additional Images */}
            {post.imageUrls && post.imageUrls.length > 1 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gambar Lainnya
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.imageUrls.slice(1).map((imageUrl, index) => (
                    <div
                      key={index}
                      className="aspect-video relative bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`${post.title} ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags/Categories */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Kategori:
                </span>
                <Badge variant="outline">{post.type}</Badge>
                <Badge variant="outline">{post.status}</Badge>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPostsFiltered.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artikel Terkait
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPostsFiltered.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
                      <Image
                        src={
                          relatedPost.imageUrls?.[0] ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedPost.body.length > 100
                          ? `${relatedPost.body.substring(0, 100)}...`
                          : relatedPost.body}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {formatDate(relatedPost.createdAt)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {relatedPost.type}
                        </Badge>
                      </div>
                      <Link href={`/artikel/${relatedPost.slug}`}>
                        <Button className="w-full bg-amber-800 hover:bg-amber-700">
                          Baca Artikel
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-amber-800 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Tertarik dengan Paket Kami?
            </h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Hubungi tim kami untuk konsultasi gratis dan dapatkan paket haji
              atau umroh yang sesuai dengan kebutuhan Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                className="bg-white text-amber-800 hover:bg-gray-100"
                onClick={() =>
                  window.open("https://wa.me/6281234567890", "_blank")
                }
              >
                Konsultasi via WhatsApp
              </Button>
              <Link href="/paket">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-amber-800 bg-transparent w-full sm:w-auto"
                >
                  Lihat Paket Wisata
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-10 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <Skeleton className="h-6 w-20 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton className="aspect-video w-full rounded-lg mb-8" />

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
