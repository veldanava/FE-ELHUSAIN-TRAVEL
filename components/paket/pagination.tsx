// components/paket/pagination.tsx
"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };

  // Helper function untuk membuat daftar angka halaman dengan elipsis
  const generatePagination = (): (number | string)[] => {
    // Jika total halaman sedikit, tampilkan semua angka
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Jika halaman saat ini dekat dengan awal
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // Jika halaman saat ini dekat dengan akhir
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Jika halaman saat ini di tengah-tengah
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (totalPages <= 1) return null;

  const pageNumbers = generatePagination();

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8">
      {/* Tombol ke Halaman Pertama */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage <= 1}
        className="hidden sm:flex"
      >
        <ChevronFirst className="h-4 w-4" />
      </Button>

      {/* Tombol Halaman Sebelumnya */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Tombol Angka Halaman */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 py-2 text-gray-500">
              {page}
            </span>
          )
        )}
      </div>

      {/* Tombol Halaman Berikutnya */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Tombol ke Halaman Terakhir */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="hidden sm:flex"
      >
        <ChevronLast className="h-4 w-4" />
      </Button>
    </div>
  );
}
