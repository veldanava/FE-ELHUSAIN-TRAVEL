// app/dashboard/paket/images/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, X, ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/dashboard/image-uploader";
import { usePackageImages } from "@/hooks/use-package-image";
import { usePackages, type TourPackage } from "@/hooks/use-package";

interface ImageManagementPageProps {
  params: Promise<{ id: string }>;
}

export default function ImageManagementPage({
  params,
}: ImageManagementPageProps) {
  const {
    packages,
    isLoading: isPackagesLoading,
    updateMainImage,
  } = usePackages();
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { id } = React.use(params);
  const packageId = parseInt(id, 10);

  const {
    images: currentPackageImages,
    isLoading: isImagesLoading,
    deleteImage,
  } = usePackageImages(packageId);

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!isPackagesLoading && packages.length > 0) {
      const foundPackage = packages.find((pkg) => pkg.id === packageId);
      if (foundPackage) {
        setPackageData(foundPackage);
      } else {
        setNotFound(true);
      }
    }
  }, [packages, isPackagesLoading, packageId]);

  const handleSetMainImage = async (imageUrl: string) => {
    if (!packageData) return;
    try {
      await updateMainImage({
        packageId: packageData.id,
        imageUrl: imageUrl,
      });
      // Update local package data
      setPackageData((prev) =>
        prev ? { ...prev, mainImageUrl: imageUrl } : null
      );
    } catch (error) {
      console.error("Failed to set main image:", error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;
    try {
      await deleteImage(imageId);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  if (isPackagesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/paket">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-60 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 w-full bg-muted animate-pulse rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/paket">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Paket Tidak Ditemukan</h1>
            <p className="text-muted-foreground">
              Paket yang Anda cari tidak dapat ditemukan
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Paket wisata tidak ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                Paket dengan ID {packageId} tidak dapat ditemukan atau mungkin
                telah dihapus.
              </p>
              <Link href="/dashboard/paket">
                <Button>Kembali ke Daftar Paket</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/paket">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Kelola Gambar Paket</h1>
          <p className="text-muted-foreground">
            Upload dan atur gambar untuk paket:{" "}
            <span className="font-semibold">{packageData.title}</span>
          </p>
        </div>
      </div>

      {/* Package Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Paket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 relative bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {packageData.mainImageUrl ? (
                <Image
                  src={`${IMAGE_BASE_URL}${
                    packageData.mainImageUrl.startsWith("/")
                      ? packageData.mainImageUrl
                      : `/${packageData.mainImageUrl}`
                  }`}
                  alt={packageData.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{packageData.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                {packageData.shortDescription}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span>Kategori: {packageData.category?.name || "N/A"}</span>
                <Badge variant={packageData.isActive ? "default" : "secondary"}>
                  {packageData.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Gambar Baru</CardTitle>
          <CardDescription>
            Upload gambar untuk paket wisata ini. Gambar yang diupload akan
            ditambahkan ke galeri.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            packageId={packageData.id}
            onUploadComplete={() => {
              // Images will be refreshed automatically by the hook
            }}
          />
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Galeri Gambar ({currentPackageImages.length})</CardTitle>
          <CardDescription>
            Kelola gambar yang sudah diupload. Klik &quot;Atur Sebagai
            Utama&quot; untuk mengubah gambar utama paket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isImagesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : currentPackageImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada gambar
              </h3>
              <p className="text-gray-600">
                Upload gambar pertama untuk paket wisata ini menggunakan form di
                atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentPackageImages.map((img) => (
                <Card key={img.id} className="relative group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative bg-muted">
                      {img.imageUrl &&
                      typeof img.imageUrl === "string" &&
                      img.imageUrl.trim() !== "" ? (
                        <Image
                          src={`${IMAGE_BASE_URL}${img.imageUrl}`}
                          alt={`Gambar untuk ${packageData.title}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                          URL Gambar Invalid
                        </div>
                      )}

                      {/* Main image badge */}
                      {packageData.mainImageUrl === img.imageUrl && (
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                          Gambar Utama
                        </Badge>
                      )}

                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(img.id)}
                        title="Hapus Gambar"
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                        <div className="p-3 w-full">
                          <div className="flex items-center justify-between text-white text-xs mb-2">
                            <span>Urutan: {img.displayOrder}</span>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs h-7"
                            onClick={() => handleSetMainImage(img.imageUrl)}
                            disabled={packageData.mainImageUrl === img.imageUrl}
                          >
                            {packageData.mainImageUrl === img.imageUrl
                              ? "Gambar Utama"
                              : "Atur Sebagai Utama"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
