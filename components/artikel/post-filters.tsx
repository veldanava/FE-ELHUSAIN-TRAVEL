"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";

interface PostFiltersProps {
  totalResults: number;
}

export default function PostFilters({ totalResults }: PostFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset ke halaman 1

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebounceCallback((term: string) => {
    handleFilterChange("search", term);
  }, 300);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari artikel..."
            defaultValue={searchParams.get("search")?.toString() || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          defaultValue={searchParams.get("type")?.toString() || "all"}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="BLOG">Blog</SelectItem>
            <SelectItem value="NEWS">News</SelectItem>
            <SelectItem value="INFORMATION">Information</SelectItem>
            <SelectItem value="CATALOG">Catalog</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("sort")?.toString() || "newest"}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="title">Judul A-Z</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center md:justify-start">
          <span className="text-sm text-gray-600">
            {totalResults} artikel ditemukan
          </span>
        </div>
      </div>
    </div>
  );
}
