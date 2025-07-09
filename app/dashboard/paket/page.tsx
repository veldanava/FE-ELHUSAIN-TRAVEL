"use client";

import { useState } from "react";
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
import { Plus, Edit, Trash2, ImageIcon, Loader2 } from "lucide-react";
import {
  usePackages,
  type TourPackage,
  type CreatePackageData,
  type UpdatePackageData,
} from "@/hooks/use-package";
import { PackageForm } from "@/components/dashboard/package-form";
import { ImageUpload } from "@/components/dashboard/image-uploader";

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
  } = usePackages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(
    null
  );
  const [selectedPackageForImages, setSelectedPackageForImages] =
    useState<TourPackage | null>(null);

  const handleCreate = async (data: CreatePackageData) => {
    try {
      await createPackage(data);
      setIsDialogOpen(false);
      setEditingPackage(null);
    } catch {
      // Error handled in hook
    }
  };

  const handleUpdate = async (data: CreatePackageData) => {
    if (!editingPackage) return;

    try {
      const updateData: UpdatePackageData = {
        ...data,
        id: editingPackage.id,
      };
      await updatePackage(updateData);
      setIsDialogOpen(false);
      setEditingPackage(null);
    } catch {
      // Error handled in hook
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;
    await deletePackage(id);
  };

  const handleImageManagement = (pkg: TourPackage) => {
    setSelectedPackageForImages(pkg);
    setIsImageDialogOpen(true);
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
                  <TableHead>Aksi</TableHead>
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={isDeleting === pkg.id}
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
              {selectedPackageForImages?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedPackageForImages && (
            <ImageUpload
              packageId={selectedPackageForImages.id}
              onUploadComplete={() => {
                // Optionally refresh package data or show success message
                setIsImageDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
