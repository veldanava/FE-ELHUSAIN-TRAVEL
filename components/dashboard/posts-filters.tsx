// components/dashboard/posts-filters.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface PostsFiltersProps {
  totalResults: number;
  currentFilters: {
    search: string;
    type: string;
    status: string;
    sort: string;
    limit: string;
  };
}

export default function PostsFilters({
  totalResults,
  currentFilters,
}: PostsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(currentFilters.search);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      updateFilter("search", localSearch);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localSearch]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    if (key !== "page" && key !== "limit") {
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push("/dashboard/posts");
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.search ||
      currentFilters.type !== "all" ||
      currentFilters.status !== "all" ||
      currentFilters.sort !== "newest"
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Pencarian</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Cari posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
            {localSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setLocalSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <Label>Tipe</Label>
          <Select
            value={currentFilters.type}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="BLOG">Blog</SelectItem>
              <SelectItem value="NEWS">News</SelectItem>
              <SelectItem value="CATALOG">Catalog</SelectItem>
              <SelectItem value="INFORMATION">Information</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={currentFilters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Urutkan</Label>
          <Select
            value={currentFilters.sort}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="title-asc">Judul A-Z</SelectItem>
              <SelectItem value="title-desc">Judul Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Info and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Menampilkan {totalResults} posts
            {currentFilters.search && ` untuk "${currentFilters.search}"`}
            {currentFilters.type !== "all" &&
              ` dengan tipe "${currentFilters.type}"`}
            {currentFilters.status !== "all" &&
              ` dengan status "${currentFilters.status}"`}
          </div>
          {hasActiveFilters() && (
            <div className="text-xs text-muted-foreground">
              Filter aktif - klik &quot;Reset Filter&quot; untuk melihat semua
              data
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Items per page */}
          <div className="flex items-center gap-2">
            <Label htmlFor="limit" className="text-sm whitespace-nowrap">
              Per halaman:
            </Label>
            <Select
              value={currentFilters.limit}
              onValueChange={(value) => updateFilter("limit", value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset button */}
          {hasActiveFilters() && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
