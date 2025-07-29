"use client";

import Link from "next/link";
import Image from "next/image";
import { usePosts } from "@/hooks/use-article"; // import hook

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
}

export default function Article() {
  // Use custom hook to fetch posts (limit 3)
  const { posts, isLoading } = usePosts({ limit: 3 });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-[20px] font-bold md:ml-20">Artikel</h1>
          <Link href="/artikel">
            <button className="btn btn-warning text-white hidden flex-none lg:block md:mr-20">
              Lihat Semua
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-20">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-xl flex flex-col h-full animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded-t"></div>
                  <div className="card-body">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            : posts.map((article: any) => (
                <div
                  key={article.id}
                  className="card bg-base-100 shadow-xl flex flex-col h-full"
                >
                  <figure>
                    <Image
                      src={article.imageUrls?.[0] || "/placeholder.svg"}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <span className="badge badge-xs badge-warning">
                      Artikel
                    </span>
                    <h2 className="text-xl font-bold mt-2">{article.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{article.body}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.createdAt)}
                      </span>
                      {/* <span className="text-xs text-gray-500">
                        Oleh: {article.author || "Admin"}
                      </span> */}
                    </div>
                    <div className="mt-4">
                      <Link href={`/artikel/${article.id}`}>
                        <button className="btn btn-warning btn-block text-white">
                          Baca Selengkapnya
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
