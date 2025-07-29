// components/dashboard/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  ImageIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TourPackage } from "@/hooks/use-package";
import DashboardFilters from "@/components/dashboard/dashboard-filters";
import DashboardActions from "@/components/dashboard/dashboard-actions";
import DeletePackageButton from "@/components/dashboard/delete-package-button";
import ImageWithFallback from "@/components/dashboard/image-with-fallback";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";
const API_HOST = process.env.API_HOST || "http://localhost:3000/api";

interface DashboardPageProps {
  searchParams?: {
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl || imageUrl.trim() === "") {
    return "/images/placeholder.jpg";
  }
  return `${IMAGE_BASE_URL}${
    imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
  }`;
};

// Loading component
// function DashboardSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <Skeleton className="h-8 w-48 mb-2" />
//           <Skeleton className="h-4 w-64" />
//         </div>
//         <Skeleton className="h-10 w-32" />
//       </div>

//       {/* Filter skeleton */}
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-6 w-40" />
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="space-y-2">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between items-center">
//             <Skeleton className="h-4 w-40" />
//             <Skeleton className="h-8 w-24" />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table skeleton */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div>
//               <Skeleton className="h-6 w-40" />
//               <Skeleton className="h-4 w-32" />
//             </div>
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-10 w-20" />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="flex items-center space-x-4">
//                 <Skeleton className="h-12 w-12" />
//                 <div className="space-y-2 flex-1">
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-3 w-2/3" />
//                 </div>
//                 <div className="flex space-x-2">
//                   <Skeleton className="h-8 w-8" />
//                   <Skeleton className="h-8 w-8" />
//                   <Skeleton className="h-8 w-8" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}

function DashboardPagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    // Ambil representasi string "foo=bar&baz=qux"
    const raw = searchParams.toString();
    // Baru bikin URLSearchParams baru
    const params = new URLSearchParams(raw);

    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= showPages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - showPages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Link href={createPageUrl(Math.max(1, currentPage - 1))}>
          <Button variant="outline" size="sm" disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((pageNumber) => (
            <Link key={pageNumber} href={createPageUrl(pageNumber)}>
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            </Link>
          ))}
        </div>

        <Link href={createPageUrl(Math.min(totalPages, currentPage + 1))}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Main component
export default async function PaketPage({ searchParams }: DashboardPageProps) {
  const search = searchParams?.search || "";
  const categoryId = searchParams?.category || "all";
  const status = searchParams?.status || "all";
  const sortBy = searchParams?.sort || "newest";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  // Build URL parameters for API call
  const params = new URLSearchParams({
    page: currentPage.toString(),
    limit: limit.toString(),
    sort: sortBy,
  });

  if (search) params.set("search", search);
  if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
  if (status && status !== "all")
    params.set("isActive", status === "active" ? "true" : "false");

  let packages: TourPackage[] = [];
  let categories = [];
  let meta = { totalCount: 0, totalPages: 0 };

  try {
    // Fetch packages and categories in parallel
    const [packagesRes, categoriesRes] = await Promise.all([
      fetch(`${API_HOST}/tour-packages?${params.toString()}`, {
        cache: "no-store", // Always get fresh data for admin
      }),
      fetch(`${API_HOST}/categories`, {
        next: { revalidate: 300 }, // Cache categories for 5 minutes
      }),
    ]);

    if (packagesRes.ok) {
      const packagesData = await packagesRes.json();
      packages = packagesData.data || [];
      meta = packagesData.meta || { totalCount: 0, totalPages: 0 };
    }

    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      categories = categoriesData.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Continue with empty data - will show empty state
  }

  // Calculate pagination info
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, meta.totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Paket Travel</h1>
          <p className="text-muted-foreground">
            Kelola paket travel yang tersedia
          </p>
        </div>
        <DashboardActions />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardFilters
            categories={categories}
            totalResults={meta.totalCount}
            currentFilters={{
              search,
              category: categoryId,
              status,
              sort: sortBy,
              limit: limit.toString(),
            }}
          />
        </CardContent>
      </Card>

      {/* Package Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Paket Wisata</CardTitle>
              <CardDescription>
                {meta.totalCount > 0 ? (
                  <>
                    Menampilkan {startItem} - {endItem} dari {meta.totalCount}{" "}
                    paket
                    {search && ` untuk "${search}"`}
                    {categoryId !== "all" &&
                      categories.find(
                        (c: any) => c.id.toString() === categoryId
                      ) &&
                      ` dalam kategori "${
                        categories.find(
                          (c: any) => c.id.toString() === categoryId
                        )?.name
                      }"`}
                    {status !== "all" &&
                      ` dengan status ${
                        status === "active" ? "aktif" : "nonaktif"
                      }`}
                  </>
                ) : (
                  "Tidak ada paket ditemukan"
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {meta.totalCount === 0 &&
                !search &&
                categoryId === "all" &&
                status === "all"
                  ? "Belum ada paket wisata"
                  : "Tidak ada paket ditemukan"}
              </h3>
              <p className="text-gray-600 mb-4">
                {meta.totalCount === 0 &&
                !search &&
                categoryId === "all" &&
                status === "all"
                  ? "Mulai dengan menambahkan paket wisata pertama Anda"
                  : "Coba ubah filter pencarian Anda atau reset filter"}
              </p>
              {meta.totalCount === 0 &&
              !search &&
              categoryId === "all" &&
              status === "all" ? (
                <DashboardActions />
              ) : (
                <Link href="/dashboard/paket">
                  <Button variant="outline">Reset Filter</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gambar Utama</TableHead>
                      <TableHead className="w-[150px] text-center">
                        Aksi
                      </TableHead>
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
                        <TableCell>
                          {pkg.category?.name ? (
                            <Badge variant="outline">{pkg.category.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(Number(pkg.price))}
                        </TableCell>
                        <TableCell>{pkg.duration} hari</TableCell>
                        <TableCell>
                          <Badge
                            variant={pkg.isActive ? "default" : "secondary"}
                          >
                            {pkg.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pkg.mainImageUrl &&
                          typeof pkg.mainImageUrl === "string" &&
                          pkg.mainImageUrl.trim() !== "" ? (
                            <div className="relative w-16 h-16">
                              <ImageWithFallback
                                src={getImageUrl(pkg.mainImageUrl)}
                                fallbackSrc="/images/placeholder.jpg"
                                alt={pkg.title || "Main Image"}
                                fill
                                className="object-cover rounded-md"
                                sizes="64px"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                              <span className="text-muted-foreground text-xs text-center">
                                No Image
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              title="Edit Paket"
                            >
                              <Link href={`/dashboard/paket/edit/${pkg.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              title="Kelola Gambar"
                            >
                              <Link href={`/dashboard/paket/images/${pkg.id}`}>
                                <ImageIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeletePackageButton
                              packageId={pkg.id}
                              packageTitle={pkg.title}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <DashboardPagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                searchParams={searchParams || {}}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
