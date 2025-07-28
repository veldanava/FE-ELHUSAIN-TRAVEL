"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import type { Post, CreatePostData, UpdatePostData } from "@/hooks/use-article";
import Image from "next/image";

interface PostFormProps {
  post?: Post | null;
  onSubmit: (data: CreatePostData | UpdatePostData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const postTypes = [
  { value: "BLOG", label: "Blog" },
  { value: "CATALOG", label: "Catalog" },
  { value: "NEWS", label: "News" },
  { value: "INFORMATION", label: "Information" },
];

const postStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

export function PostForm({
  post: editPost,
  onSubmit,
  onCancel,
  isLoading,
}: PostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    body: "",
    type: "BLOG" as "BLOG" | "CATALOG" | "NEWS" | "INFORMATION",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title,
        slug: editPost.slug,
        body: editPost.body,
        type: editPost.type,
        status: editPost.status,
      });
      // Set existing image previews
      setImagePreviews(editPost.imageUrls || []);
    } else {
      setFormData({
        title: "",
        slug: "",
        body: "",
        type: "BLOG",
        status: "DRAFT",
      });
      setImagePreviews([]);
    }
    setSelectedImages([]);
  }, [editPost]);

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

    const submitData = editPost
      ? ({
          ...formData,
          images: selectedImages.length > 0 ? selectedImages : undefined,
        } as UpdatePostData)
      : ({
          ...formData,
          images: selectedImages,
        } as CreatePostData);

    await onSubmit(submitData);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !editPost ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    setSelectedImages(validFiles);

    // Create previews
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      setSelectedImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Judul post"
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
            placeholder="slug-post"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipe *</Label>
          <Select
            value={formData.type}
            onValueChange={(
              value: "BLOG" | "CATALOG" | "NEWS" | "INFORMATION"
            ) => setFormData({ ...formData, type: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "DRAFT" | "PUBLISHED") =>
              setFormData({ ...formData, status: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {postStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Konten *</Label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Konten post..."
          rows={8}
          required
          disabled={isLoading}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Gambar</Label>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <div className="aspect-video relative bg-gray-200 rounded overflow-hidden">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card
          className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag & drop gambar atau klik untuk memilih
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, JPEG hingga 5MB per file
            </p>
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          disabled={isLoading}
        />
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
              {editPost ? "Mengupdate..." : "Menyimpan..."}
            </>
          ) : editPost ? (
            "Update"
          ) : (
            "Simpan"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
