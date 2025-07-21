// components/dashboard/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, ImageIcon, Loader2, X } from "lucide-react"; // Import X untuk tombol hapus gambar
import {
  usePackages,
  type TourPackage,
  type CreatePackageData,
  type UpdatePackageData,
} from "@/hooks/use-package";
import { PackageForm } from "@/components/dashboard/package-form";
import { ImageUpload } from "@/components/dashboard/image-uploader";
import { usePackageImages } from "@/hooks/use-package-image";

export default function PaketPage() {
  const {
    packages,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createPackage,
    updatePackage,
    deletePackage,
    updateMainImage,
  } = usePackages();

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(
    null
  );
  const [selectedPackageForImages, setSelectedPackageForImages] =
    useState<TourPackage | null>(null);

  // usePackageImages hook secara otomatis akan refetch saat packageId berubah
  // atau saat invalidateQueries dipanggil dari mutasi di use-package-image.ts
  const {
    images: currentPackageImages,
    isLoading: isImagesLoading,
    deleteImage,
    // updateImageOrder, // Jika tidak digunakan, bisa dihapus atau dikomentari
  } = usePackageImages(selectedPackageForImages?.id);

  const handleCreate = async (data: CreatePackageData) => {
    try {
      await createPackage(data);
      setIsDialogOpen(false);
      setEditingPackage(null);
    } catch {
      // Error handled in hook (toast.error)
    }
  };

  const handleUpdate = async (data: CreatePackageData) => {
    if (!editingPackage) return;

    try {
      const updateData: UpdatePackageData = {
        ...data,
        id: editingPackage.id,
        // mainImageUrl tidak perlu dikirim dari sini karena diupdate via handleSetMainImage
        // atau jika di form PackageForm Anda masih ada field mainImageUrl, pastikan itu tidak ikut di sini
        // karena usePackages hook sudah mengharapkan hanya properti yang diubah
      };
      await updatePackage(updateData);
      setIsDialogOpen(false);
      setEditingPackage(null);
    } catch {
      // Error handled in hook (toast.error)
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;
    await deletePackage(id); // Error handled in hook
  };

  const handleImageManagement = (pkg: TourPackage) => {
    setSelectedPackageForImages(pkg);
    setIsImageDialogOpen(true);
  };

  const handleSetMainImage = async (imageUrl: string) => {
    if (!selectedPackageForImages) return;
    try {
      await updateMainImage({
        packageId: selectedPackageForImages.id,
        imageUrl: imageUrl,
      });
      // Tidak perlu setIsImageDialogOpen(false) di sini kecuali Anda ingin otomatis menutup
      // dialog setelah set gambar utama. Biasanya dibiarkan terbuka untuk aksi lain.
    } catch (error) {
      console.error("Failed to set main image:", error); // console.error di sini lebih baik
    }
  };

  const openCreateDialog = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paket Wisata</h1>
          <p className="text-muted-foreground">
            Kelola paket wisata yang tersedia
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Paket Wisata" : "Tambah Paket Wisata"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update informasi paket wisata"
                  : "Buat paket wisata baru"}
              </DialogDescription>
            </DialogHeader>
            <PackageForm
              package={editingPackage}
              onSubmit={editingPackage ? handleUpdate : handleCreate}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isCreating || isUpdating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Paket Wisata</CardTitle>
          <CardDescription>
            Total {packages.length} paket wisata
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada paket wisata</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Paket Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gambar Utama</TableHead>
                  <TableHead className="w-[150px] text-center">Aksi</TableHead>
                  {/* Lebarkan kolom Aksi */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pkg.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.shortDescription.length > 50
                            ? `${pkg.shortDescription.substring(0, 50)}...`
                            : pkg.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pkg.category?.name || "N/A"}</TableCell>
                    <TableCell>{formatPrice(Number(pkg.price))}</TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pkg.mainImageUrl &&
                      typeof pkg.mainImageUrl === "string" &&
                      pkg.mainImageUrl.trim() !== "" ? (
                        <Image
                          // Ensure pkg.mainImageUrl starts with a '/' before concatenating
                          src={`${IMAGE_BASE_URL}${
                            pkg.mainImageUrl.startsWith("/")
                              ? pkg.mainImageUrl
                              : `/${pkg.mainImageUrl}`
                          }`}
                          alt={pkg.title || "Main Image"}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                            (e.target as HTMLImageElement).alt =
                              "Gambar tidak dapat dimuat";
                          }}
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs text-center w-16">
                          Belum ada gambar utama
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                          title="Edit Paket" // Tambahkan tooltip
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={isDeleting === pkg.id}
                          title="Hapus Paket" // Tambahkan tooltip
                        >
                          {isDeleting === pkg.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageManagement(pkg)}
                          title="Kelola Gambar" // Tambahkan tooltip
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Image Management Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Gambar Paket</DialogTitle>
            <DialogDescription>
              Upload dan atur gambar untuk paket:{" "}
              <span className="font-semibold">
                {selectedPackageForImages?.title}
              </span>
            </DialogDescription>
          </DialogHeader>
          {selectedPackageForImages && (
            <div className="space-y-6">
              <ImageUpload
                packageId={selectedPackageForImages.id}
                onUploadComplete={() => {
                  // onUploadComplete dari ImageUpload sekarang bisa memicu invalidasi
                  // usePackageImages hook secara otomatis akan refetch
                  // Tidak perlu melakukan apa-apa di sini jika usePackageImages sudah diatur dengan baik
                }}
              />

              {isImagesLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {" "}
                  {/* Grid responsive */}
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">
                    Gambar Tersedia ({currentPackageImages.length})
                  </h3>
                  {currentPackageImages.length === 0 ? (
                    <p className="text-muted-foreground">
                      Belum ada gambar untuk paket ini.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {currentPackageImages.map((img) => (
                        <Card key={img.id} className="relative group">
                          <CardContent className="p-2">
                            <div className="aspect-square relative bg-muted rounded overflow-hidden mb-2">
                              {/* Pastikan src valid sebelum dirender */}
                              {img.imageUrl &&
                              typeof img.imageUrl === "string" &&
                              img.imageUrl.trim() !== "" ? (
                                <Image
                                  src={`${IMAGE_BASE_URL}${img.imageUrl}`} // <-- Perubahan penting di sini! Gabungkan base URL
                                  alt={`Gambar untuk ${selectedPackageForImages.title}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/images/placeholder.jpg";
                                    (e.target as HTMLImageElement).alt =
                                      "Gambar tidak dapat dimuat";
                                  }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                                  URL Gambar Invalid
                                </div>
                              )}

                              {selectedPackageForImages.mainImageUrl ===
                                img.imageUrl && (
                                <Badge className="absolute top-1 left-1 bg-green-500 text-white">
                                  Utama
                                </Badge>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteImage(img.id)}
                                title="Hapus Gambar Ini"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Urutan: {img.displayOrder}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleSetMainImage(img.imageUrl)}
                                disabled={
                                  selectedPackageForImages.mainImageUrl ===
                                  img.imageUrl
                                }
                                title={
                                  selectedPackageForImages.mainImageUrl ===
                                  img.imageUrl
                                    ? "Sudah Gambar Utama"
                                    : "Atur Sebagai Gambar Utama"
                                }
                              >
                                {selectedPackageForImages.mainImageUrl ===
                                img.imageUrl
                                  ? "Gambar Utama"
                                  : "Atur Sebagai Utama"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
