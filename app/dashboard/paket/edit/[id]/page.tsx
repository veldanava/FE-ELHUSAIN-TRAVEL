// app/dashboard/paket/edit/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PackageForm } from "@/components/dashboard/package-form";
import {
  usePackages,
  type TourPackage,
  type CreatePackageData,
  type UpdatePackageData,
} from "@/hooks/use-package";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default function EditPackagePage({ params }: EditPackagePageProps) {
  const router = useRouter();
  const { packages, isLoading, updatePackage, isUpdating } = usePackages();
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { id } = React.use(params);
  const packageId = parseInt(id, 10);

  useEffect(() => {
    if (!isLoading && packages.length > 0) {
      const foundPackage = packages.find((pkg) => pkg.id === packageId);
      if (foundPackage) {
        setPackageData(foundPackage);
      } else {
        setNotFound(true);
      }
    }
  }, [packages, isLoading, packageId]);

  const handleUpdate = async (data: CreatePackageData) => {
    if (!packageData) return;

    try {
      const updateData: UpdatePackageData = {
        ...data,
        id: packageData.id,
      };
      await updatePackage(updateData);
      router.push("/dashboard/paket?updated=true");
    } catch {
      // Error handled in hook (toast.error)
    }
  };

  if (isLoading) {
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
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
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
          <h1 className="text-3xl font-bold">Edit Paket Wisata</h1>
          <p className="text-muted-foreground">
            Ubah informasi paket wisata: {packageData.title}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Paket</CardTitle>
          <CardDescription>
            Perbarui detail paket wisata yang akan ditawarkan kepada pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PackageForm
            package={packageData}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/dashboard/paket")}
            isLoading={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
