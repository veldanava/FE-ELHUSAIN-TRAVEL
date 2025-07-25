"use client";

import { usePackages } from "@/hooks/use-package";
import { useCategories } from "@/hooks/use-categories";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MapPin, Clock, Users } from "lucide-react";
import { useState, useMemo } from "react";
import PublicLayout from "@/components/public-layout";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

export default function PaketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { packages, isLoading } = usePackages({ isActive: true });
  const { categories } = useCategories();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl || imageUrl.trim() === "") {
      return "/images/placeholder.jpg";
    }
    return `${IMAGE_BASE_URL}${
      imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    }`;
  };

  // Filter and sort packages
  const filteredAndSortedPackages = useMemo(() => {
    let filtered = packages || [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (pkg) => pkg.categoryId === Number.parseInt(selectedCategory)
      );
    }

    // Sort packages
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
    }

    return filtered;
  }, [packages, searchTerm, selectedCategory, sortBy]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 mt-12">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Paket Travel
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Temukan paket travel terbaik dengan pelayanan prima dari
                El.Husain Travel
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-sm text-gray-600">
                  {isLoading
                    ? "Memuat..."
                    : `${filteredAndSortedPackages.length} paket ditemukan`}
                </span>
              </div>
            </div>
          </div>

          {/* Package Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAndSortedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative bg-gray-200">
                    <Image
                      src={getImageUrl(pkg.mainImageUrl) || "/placeholder.svg"}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-800 text-white">
                        {pkg.category?.name || "Paket"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {pkg.shortDescription}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Makkah & Madinah</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Grup 20-30 orang</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-amber-800">
                          {formatPrice(pkg.price)}
                        </div>
                        <div className="text-xs text-gray-500">per orang</div>
                      </div>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Tersedia" : "Sold Out"}
                      </Badge>
                    </div>

                    <Link href={`/paket/${pkg.id}`}>
                      <Button
                        className="w-full bg-amber-800 hover:bg-amber-700"
                        disabled={!pkg.isActive}
                      >
                        {pkg.isActive ? "Lihat Detail" : "Tidak Tersedia"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada paket ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba ubah filter pencarian atau kata kunci Anda
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("newest");
                  }}
                  variant="outline"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-amber-800 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Tidak Menemukan Paket yang Sesuai?
            </h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Hubungi tim kami untuk konsultasi gratis dan dapatkan paket yang
              disesuaikan dengan kebutuhan Anda
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
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-800 bg-transparent"
                onClick={() => window.open("tel:+6281234567890")}
              >
                Telepon Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
