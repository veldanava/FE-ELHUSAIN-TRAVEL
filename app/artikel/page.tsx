// app/artikel/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar } from "lucide-react";
import PublicLayout from "@/components/public-layout";
import PostFilters from "@/components/artikel/post-filters";
import Pagination from "@/components/paket/pagination"; // Bisa pakai pagination yang sama
import PostGridSkeleton from "@/components/artikel/post-grid-skeleton";
import CtaButtons from "@/components/paket/cta-section"; // Bisa pakai CTA yang sama

// ----- Definisikan Tipe & Helper -----
const API_HOST = process.env.API_HOST || "http://localhost:3000/api";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";

interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  type: string;
  createdAt: string;
  imageUrls: string[];
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ----- Fungsi Pengambilan Data -----
async function getPostsData(params: URLSearchParams) {
  try {
    const res = await fetch(`${API_HOST}/posts?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { posts: [], meta: { totalCount: 0, totalPages: 1 } };
    const data = await res.json();
    return { posts: data.posts, meta: data.meta };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [], meta: { totalCount: 0, totalPages: 1 } };
  }
}

// ----- Komponen Async untuk Grid -----
async function PostGrid({ params }: { params: URLSearchParams }) {
  const { posts } = await getPostsData(params);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Tidak ada artikel ditemukan
        </h3>
        <p className="text-gray-600">Coba ubah filter pencarian Anda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: Post) => (
        <Card
          key={post.id}
          className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
        >
          <Link
            href={`/artikel/${post.slug}`}
            className="block aspect-video relative bg-gray-200"
          >
            <Image
              src={
                post.imageUrls?.[0]
                  ? `${IMAGE_BASE_URL}${post.imageUrls[0]}`
                  : "/images/placeholder.jpg"
              }
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-800 text-white">{post.type}</Badge>
            </div>
          </Link>
          <CardContent className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.body}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="mt-auto">
              <Link href={`/artikel/${post.slug}`}>
                <Button className="w-full bg-amber-800 hover:bg-amber-700">
                  Baca Selengkapnya
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ----- Halaman Utama (Server Component) -----
export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = Number(searchParams?.page) || 1;

  // Siapkan parameter untuk fetch
  // =====================================================================
  // PERBAIKAN: Ubah searchParams menjadi objek dengan semua value string sebelum digunakan
  const plainSearchParams: Record<string, string> = Object.fromEntries(
    Object.entries(searchParams || {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] ?? "" : value ?? "",
    ])
  );
  const params = new URLSearchParams(plainSearchParams);
  // =====================================================================
  params.set("page", currentPage.toString());
  params.set("limit", "9");
  params.set("status", "PUBLISHED"); // Selalu ambil yang sudah publish

  const { meta } = await getPostsData(params); // Ambil metadata untuk filter & pagination

  return (
    <PublicLayout>
      <div className="bg-gray-50 mt-12">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Artikel & Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Baca artikel terbaru seputar haji, umroh, dan tips perjalanan
              ibadah
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostFilters totalResults={meta.totalCount} />

          <div className="mt-8">
            <Suspense key={params.toString()} fallback={<PostGridSkeleton />}>
              <PostGrid params={params} />
            </Suspense>
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
              />
            </div>
          )}
        </div>

        {/* CTA Section */}
        <CtaButtons />
      </div>
    </PublicLayout>
  );
}
