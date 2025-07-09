"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface TourPackage {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  duration: string;
  mainImageUrl: string;
  categoryId: number;
  isActive: boolean;
  category?: Category;
}

interface PackageFormData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  duration: string;
  mainImageUrl: string;
  categoryId: string;
  isActive: boolean;
}

export default function PaketPage() {
  const { admin } = useAuth();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(
    null
  );
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    duration: "",
    mainImageUrl: "",
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockPackages: TourPackage[] = [
        {
          id: 1,
          title: "Paket Wisata Malang Batu",
          slug: "paket-malang-batu-3-hari",
          shortDescription:
            "Nikmati wisata di Malang dan Batu selama 3 hari 2 malam.",
          fullDescription:
            "Detail perjalanan lengkap meliputi Jatim Park, Museum Angkut, dan wisata kuliner khas Malang.",
          price: 1500000,
          duration: "3 hari 2 malam",
          mainImageUrl: "/uploads/packages/1/main-image.jpg",
          categoryId: 1,
          isActive: true,
          category: { id: 1, name: "Wisata Alam", slug: "wisata-alam" },
        },
        {
          id: 2,
          title: "Paket Wisata Bromo",
          slug: "paket-bromo-sunrise",
          shortDescription: "Saksikan sunrise terbaik di Gunung Bromo.",
          fullDescription:
            "Perjalanan menuju Bromo untuk menyaksikan sunrise yang menakjubkan.",
          price: 800000,
          duration: "2 hari 1 malam",
          mainImageUrl: "/uploads/packages/2/main-image.jpg",
          categoryId: 1,
          isActive: true,
          category: { id: 1, name: "Wisata Alam", slug: "wisata-alam" },
        },
      ];
      setPackages(mockPackages);
    } catch {
      toast.error("Gagal memuat paket wisata");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockCategories: Category[] = [
        { id: 1, name: "Wisata Alam", slug: "wisata-alam" },
        { id: 2, name: "Wisata Budaya", slug: "wisata-budaya" },
        { id: 3, name: "Wisata Kuliner", slug: "wisata-kuliner" },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        price: Number.parseInt(formData.price),
        duration: formData.duration,
        mainImageUrl: formData.mainImageUrl,
        categoryId: Number.parseInt(formData.categoryId),
        isActive: formData.isActive,
      };

      // Replace with actual API call
      const response = await fetch("/api/tour-packages", {
        method: editingPackage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(
          editingPackage ? { ...payload, id: editingPackage.id } : payload
        ),
      });

      if (response.ok) {
        toast.success(
          `Paket wisata ${
            editingPackage ? "berhasil diperbarui" : "berhasil dibuat"
          }`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchPackages();
      } else {
        throw new Error("Failed to save package");
      }
    } catch {
      toast.error("Gagal menyimpan paket wisata");
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      slug: pkg.slug,
      shortDescription: pkg.shortDescription,
      fullDescription: pkg.fullDescription,
      price: pkg.price.toString(),
      duration: pkg.duration,
      mainImageUrl: pkg.mainImageUrl,
      categoryId: pkg.categoryId.toString(),
      isActive: pkg.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;

    try {
      // Replace with actual API call
      const response = await fetch(`/api/tour-packages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (response.ok) {
        toast.success("Paket wisata berhasil dihapus");
        fetchPackages();
      } else {
        throw new Error("Failed to delete package");
      }
    } catch {
      toast.error("Gagal menghapus paket wisata");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      price: "",
      duration: "",
      mainImageUrl: "",
      categoryId: "",
      isActive: true,
    });
    setEditingPackage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Paket Wisata</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        richColors
        position="top-right"
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
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
              <Button onClick={resetForm}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Paket</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!editingPackage) {
                          setFormData((prev) => ({
                            ...prev,
                            slug: generateSlug(e.target.value),
                          }));
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Deskripsi Singkat</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Deskripsi Lengkap</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullDescription: e.target.value,
                      })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga (Rp)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="3 hari 2 malam"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainImageUrl">URL Gambar Utama</Label>
                    <Input
                      id="mainImageUrl"
                      value={formData.mainImageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mainImageUrl: e.target.value,
                        })
                      }
                      placeholder="/uploads/packages/1/main-image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Kategori</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive">Paket Aktif</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingPackage ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
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
                          {pkg.shortDescription.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{pkg.category?.name}</TableCell>
                    <TableCell>
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </TableCell>
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
