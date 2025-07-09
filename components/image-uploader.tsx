"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { usePackageImages } from "@/hooks/use-package-image";

// Remove local PackageImage interface and import it from the hook
import type { PackageImage } from "@/hooks/use-package-image";

interface ImageUploadProps {
  packageId: number;
  onUploadComplete?: (images: PackageImage[]) => void;
}

interface FileWithPreview extends File {
  preview?: string;
  displayOrder?: number;
}

export function ImageUpload({ packageId, onUploadComplete }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadMultipleImages } = usePackageImages();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filesWithPreview = files.map((file, index) => {
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.preview = URL.createObjectURL(file);
      fileWithPreview.displayOrder = selectedFiles.length + index + 1;
      return fileWithPreview;
    });

    setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Update display order
      return newFiles.map((file, i) => ({
        ...file,
        displayOrder: i + 1,
      }));
    });
  };

  const updateDisplayOrder = (index: number, newOrder: number) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, displayOrder: newOrder } : file
      )
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      // Sort files by display order before upload
      const sortedFiles = [...selectedFiles].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
      );

      const results = await uploadMultipleImages(packageId, sortedFiles);

      // Clean up previews
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      setSelectedFiles([]);
      onUploadComplete?.(results);
    } catch (error) {
      console.error("Upload failed:", error);
    }
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
      const filesWithPreview = files.map((file, index) => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        fileWithPreview.displayOrder = selectedFiles.length + index + 1;
        return fileWithPreview;
      });

      setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Gambar Paket</Label>
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
              PNG, JPG, JPEG hingga 5MB
            </p>
          </CardContent>
        </Card>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <div className="aspect-video relative bg-muted rounded overflow-hidden">
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`order-${index}`} className="text-xs">
                        Urutan:
                      </Label>
                      <Input
                        id={`order-${index}`}
                        type="number"
                        min="1"
                        value={file.displayOrder || index + 1}
                        onChange={(e) =>
                          updateDisplayOrder(
                            index,
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                        className="h-6 w-16 text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mengupload gambar...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                `Upload ${selectedFiles.length} Gambar`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
