// components/dashboard/package-form.tsx
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, X } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import type { TourPackage, CreatePackageData } from "@/hooks/use-package"; // Pastikan TourPackage dan CreatePackageData sudah diimpor dengan benar

interface PackageFormProps {
  package?: TourPackage | null;
  onSubmit: (data: CreatePackageData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function PackageForm({
  package: editPackage,
  onSubmit,
  onCancel,
  isLoading,
}: PackageFormProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState<CreatePackageData>({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    price: 0,
    duration: "",
    mainImageUrl: "", // Nilai awal kosong atau string kosong
    categoryId: 0,
    isActive: true,
    features: [],
  });

  const [currentFeature, setCurrentFeature] = useState("");

  useEffect(() => {
    if (editPackage) {
      setFormData({
        title: editPackage.title,
        slug: editPackage.slug,
        shortDescription: editPackage.shortDescription,
        fullDescription: editPackage.fullDescription,
        price: Number(editPackage.price),
        duration: editPackage.duration,
        mainImageUrl: editPackage.mainImageUrl || "", // Pastikan selalu string
        categoryId: editPackage.categoryId,
        isActive: editPackage.isActive,
        features: editPackage.features || [],
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        shortDescription: "",
        fullDescription: "",
        price: 0,
        duration: "",
        mainImageUrl: "",
        categoryId: 0,
        isActive: true,
        features: [],
      });
    }
  }, [editPackage]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !editPackage ? generateSlug(title) : prev.slug, // Hanya generate slug jika membuat paket baru
    }));
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !formData.features?.includes(currentFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Paket *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Paket Wisata Malang Batu"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="paket-malang-batu-3-hari"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Deskripsi Singkat *</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          placeholder="Nikmati wisata di Malang dan Batu selama 3 hari 2 malam."
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Deskripsi Lengkap *</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData({ ...formData, fullDescription: e.target.value })
          }
          placeholder="Detail perjalanan lengkap meliputi Jatim Park, Museum Angkut, dan wisata kuliner khas Malang."
          rows={4}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Harga (Rp) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: Number.parseInt(e.target.value),
              })
            }
            placeholder="1500000"
            min="0"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Durasi *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="3 hari 2 malam"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Section untuk Features */}
      <div className="space-y-2">
        <Label>Fitur Paket</Label>
        <div className="flex gap-2">
          <Input
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            onKeyDown={handleFeatureKeyPress}
            placeholder="Masukkan fitur paket (misal: Hotel bintang 4)"
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={addFeature}
            disabled={isLoading || !currentFeature.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Daftar features yang sudah ditambahkan */}
        {formData.features && formData.features.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Fitur yang ditambahkan:
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                >
                  <span>{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={isLoading}
                    className="h-auto p-0 w-4 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input mainImageUrl dihapus dari sini */}
      {/* <div className="space-y-2">
        <Label htmlFor="mainImageUrl">URL Gambar Utama *</Label>
        <Input
          id="mainImageUrl"
          value={formData.mainImageUrl}
          onChange={(e) =>
            setFormData({ ...formData, mainImageUrl: e.target.value })
          }
          placeholder="/uploads/packages/1/main-image.jpg"
          required
          disabled={isLoading}
        />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="categoryId">Kategori *</Label>
        <Select
          value={formData.categoryId.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, categoryId: Number.parseInt(value) })
          }
          disabled={isLoading || categoriesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
          disabled={isLoading}
        />
        <Label htmlFor="isActive">Paket Aktif</Label>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editPackage ? "Mengupdate..." : "Menyimpan..."}
            </>
          ) : editPackage ? (
            "Update"
          ) : (
            "Simpan"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
