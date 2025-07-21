"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
}

export default function Article() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/articles?limit=3");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Fallback articles if API fails
        setArticles([
          {
            id: 1,
            title: "Persiapan Sebelum Berangkat Umroh",
            excerpt:
              "Panduan lengkap persiapan fisik, mental, dan perlengkapan sebelum berangkat umroh",
            imageUrl: "/placeholder.svg?height=200&width=300",
            date: "2023-05-15",
            author: "Ustadz Ahmad",
          },
          {
            id: 2,
            title: "Tata Cara Umroh yang Benar",
            excerpt:
              "Penjelasan detail tentang rukun dan tata cara umroh sesuai sunnah",
            imageUrl: "/placeholder.svg?height=200&width=300",
            date: "2023-06-20",
            author: "Ustadz Mahmud",
          },
          {
            id: 3,
            title: "Ziarah di Madinah",
            excerpt:
              "Tempat-tempat bersejarah yang direkomendasikan untuk diziarahi di Madinah",
            imageUrl: "/placeholder.svg?height=200&width=300",
            date: "2023-07-10",
            author: "Ustadzah Fatimah",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

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
          <div>
            <h1 className="text-[20px] font-bold md:ml-20">Artikel</h1>
          </div>
          <div>
            <Link href="/detail">
              <button className="btn btn-warning text-white hidden flex-none lg:block md:mr-20">
                Lihat Semua
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-3 p-4 lg:flex-row lg:items-stretch lg:flex-wrap">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="card w-96 bg-base-100 shadow-sm animate-pulse"
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
            : articles.map((article) => (
                <div
                  key={article.id}
                  className="card w-96 bg-base-100 shadow-sm"
                >
                  <figure>
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
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
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold">{article.title}</h2>
                    </div>
                    <p className="text-sm text-gray-600">{article.excerpt}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.date)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Oleh: {article.author}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/detail/${article.id}`}>
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
