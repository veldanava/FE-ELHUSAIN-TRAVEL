// components/dashboard/dashboard-actions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PackageForm } from "@/components/dashboard/package-form";
import { usePackages, type CreatePackageData } from "@/hooks/use-package";

export default function DashboardActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createPackage, isCreating } = usePackages();

  const handleCreate = async (data: CreatePackageData) => {
    try {
      await createPackage(data);
      setIsDialogOpen(false);
      // Tidak perlu reload halaman karena React Query akan otomatis update cache
      // window.location.reload(); <- Hapus ini
    } catch {
      // Error handled in hook (toast.error)
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Paket Wisata</DialogTitle>
          <DialogDescription>
            Buat paket wisata baru untuk ditawarkan kepada pelanggan
          </DialogDescription>
        </DialogHeader>
        <PackageForm
          package={null}
          onSubmit={handleCreate}
          onCancel={() => setIsDialogOpen(false)}
          isLoading={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
}
