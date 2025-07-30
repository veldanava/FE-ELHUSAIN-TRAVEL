"use client";

import { useParams, useRouter } from "next/navigation";
import { usePackageDetail } from "@/hooks/use-package-detail";
import { usePackageImages } from "@/hooks/use-package-image";
import { usePackages } from "@/hooks/use-package";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Clock,
  CheckCircle,
  Package,
  Info,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PublicLayout from "@/components/public-layout";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const { packageDetail, isLoading: isLoadingDetail } =
    usePackageDetail(packageId);
  console.log("Package Detail:", packageDetail);
  const { images, isLoading: isLoadingImages } = usePackageImages(
    packageDetail?.id ? Number(packageDetail.id) : undefined
  );
  const { packages: relatedPackages, isLoading: isLoadingRelated } =
    usePackages({
      limit: 3,
      isActive: true,
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // const formatDate = (dateString?: string) => {
  //   if (!dateString) return "N/A";
  //   return new Date(dateString).toLocaleDateString("id-ID", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl || imageUrl.trim() === "") {
      return "https://placehold.co/600x400";
    }
    return `${IMAGE_BASE_URL}${
      imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    }`;
  };

  const handleShare = async () => {
    if (navigator.share && packageDetail) {
      try {
        await navigator.share({
          title: packageDetail.title,
          text: packageDetail.shortDescription,
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

  const handleWhatsAppContact = () => {
    const message = `Halo, saya tertarik dengan paket ${packageDetail?.title}. Bisa minta informasi lebih lanjut?`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoadingDetail) {
    return <PackageDetailSkeleton />;
  }

  if (!packageDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paket tidak ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Paket yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Button onClick={() => router.push("/paket")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Paket
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [
    // Always include mainImageUrl in the array if packageDetail exists,
    // and let getImageUrl handle the placeholder if it's empty.
    {
      id: 0, // A dummy ID, since it's not from the API's 'images' array
      imageUrl: packageDetail.mainImageUrl,
      displayOrder: 0,
      packageId: packageDetail.id,
    },
    ...(images || []),
  ];

  const relatedPackagesFiltered =
    relatedPackages?.filter((pkg) => pkg.id !== packageDetail.id).slice(0, 3) ||
    [];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
                    <Image
                      src={getImageUrl(
                        allImages[selectedImageIndex]?.imageUrl ||
                          packageDetail.mainImageUrl ||
                          "https://placehold.co/600x400"
                      )}
                      alt={packageDetail.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                  {allImages.length > 1 && (
                    <div className="p-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {allImages.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              selectedImageIndex === index
                                ? "border-amber-800"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={
                                getImageUrl(image.imageUrl) ||
                                "/placeholder.svg"
                              }
                              alt={`${packageDetail.title} ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Package Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {packageDetail.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{packageDetail.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {packageDetail.category?.name || "Kategori"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={packageDetail.isActive ? "default" : "secondary"}
                    >
                      {packageDetail.isActive ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Deskripsi Singkat
                      </h3>
                      <p className="text-gray-700">
                        {packageDetail.shortDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Deskripsi Lengkap
                      </h3>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {packageDetail.fullDescription
                          .split("\n")
                          .map((paragraph, index) => (
                            <p key={index} className="mb-3">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* Package Features - Integrated with Database */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Yang Termasuk dalam Paket
                      </h3>

                      {packageDetail.features &&
                      packageDetail.features.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {packageDetail.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                            >
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-800 leading-relaxed">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <div className="text-gray-400 mb-2">
                            <Package className="h-8 w-8 mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            Fitur paket belum ditambahkan
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Admin dapat menambahkan fitur melalui dashboard
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Package Stats */}
                    {packageDetail.features &&
                      packageDetail.features.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-2 text-blue-800">
                            <Info className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Paket ini mencakup {packageDetail.features.length}{" "}
                              fitur unggulan
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & Booking */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-3xl font-bold text-amber-800">
                      {formatPrice(packageDetail.price)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">per orang</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Durasi:</span>
                      <span className="font-medium">
                        {packageDetail.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium">
                        {packageDetail.category?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        variant={
                          packageDetail.isActive ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {packageDetail.isActive ? "Tersedia" : "Tidak Tersedia"}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <Button
                      className="w-full bg-amber-800 hover:bg-amber-700"
                      onClick={handleWhatsAppContact}
                      disabled={!packageDetail.isActive}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Hubungi via WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => window.open("tel:+6281234567890")}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Telepon Sekarang
                    </Button>
                  </div>

                  <div className="text-center text-xs text-gray-500 pt-2">
                    <p>Konsultasi gratis dengan travel consultant kami</p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">El.Husain Travel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8/5 dari 1,200+ review</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>15+ tahun pengalaman</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>5,000+ jamaah terlayani</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      Bismillah Khidmat Haramain - Melayani perjalanan ibadah
                      Anda dengan sepenuh hati
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Packages */}
          {relatedPackagesFiltered.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Paket Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPackagesFiltered.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
                      <Image
                        src={
                          getImageUrl(pkg.mainImageUrl) ||
                          "https://placehold.co/600x400"
                        }
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {pkg.shortDescription}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-amber-800">
                          {formatPrice(pkg.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pkg.duration}
                        </span>
                      </div>
                      <Link href={`/paket/${pkg.id}`}>
                        <Button className="w-full bg-amber-800 hover:bg-amber-700">
                          Lihat Detail
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function PackageDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <Skeleton className="aspect-video w-full rounded-t-lg" />
                <div className="p-4">
                  <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div>
                  <Skeleton className="h-6 w-36 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-10 w-32 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
