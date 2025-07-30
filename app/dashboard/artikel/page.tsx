// app/dashboard/posts/page.tsx

import Link from "next/link";
import Image from "next/image";
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
  Eye,
  ImageIcon,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PostsFilters from "@/components/dashboard/posts-filters";
import PostsActions from "@/components/dashboard/posts-actions";
import DeletePostButton from "@/components/dashboard/delete-post-button";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";
const API_HOST = process.env.API_HOST || "http://localhost:3000/api";

// ----- Types -----
interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  type: string;
  status: string;
  createdAt: string;
  imageUrls: string[];
}

interface PostsPageProps {
  searchParams?: {
    search?: string;
    type?: string;
    status?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

// ----- Helper Functions -----
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "default" as const;
    case "DRAFT":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "BLOG":
      return "default" as const;
    case "NEWS":
      return "destructive" as const;
    case "CATALOG":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl || imageUrl.trim() === "") {
    return "/images/placeholder.jpg";
  }
  return `${IMAGE_BASE_URL}${
    imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
  }`;
};

// ----- Pagination Component -----
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function PostsPagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    // Convert searchParams to string format
    const plainParams: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        plainParams[key] = Array.isArray(value) ? value[0] || "" : value;
      }
    });

    const params = new URLSearchParams(plainParams);
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

// ----- Main Component -----
export default async function PostsPage({ searchParams }: PostsPageProps) {
  const search = searchParams?.search || "";
  const type = searchParams?.type || "all";
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
  if (type && type !== "all") params.set("type", type);
  if (status && status !== "all") params.set("status", status);

  let posts: Post[] = [];
  let meta = { totalCount: 0, totalPages: 0 };

  try {
    const response = await fetch(`${API_HOST}/posts?${params.toString()}`, {
      cache: "no-store", // Always get fresh data for admin
    });

    if (response.ok) {
      const data = await response.json();
      posts = data.posts || [];
      meta = data.meta || { totalCount: 0, totalPages: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
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
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Kelola blog, artikel, dan konten lainnya
          </p>
        </div>
        <PostsActions />
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
          <PostsFilters
            totalResults={meta.totalCount}
            currentFilters={{
              search,
              type,
              status,
              sort: sortBy,
              limit: limit.toString(),
            }}
          />
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Posts</CardTitle>
              <CardDescription>
                {meta.totalCount > 0 ? (
                  <>
                    Menampilkan {startItem} - {endItem} dari {meta.totalCount}{" "}
                    posts
                    {search && ` untuk "${search}"`}
                    {type !== "all" && ` dengan tipe "${type}"`}
                    {status !== "all" && ` dengan status "${status}"`}
                  </>
                ) : (
                  "Tidak ada posts ditemukan"
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {meta.totalCount === 0 &&
                !search &&
                type === "all" &&
                status === "all"
                  ? "Belum ada posts"
                  : "Tidak ada posts ditemukan"}
              </h3>
              <p className="text-gray-600 mb-4">
                {meta.totalCount === 0 &&
                !search &&
                type === "all" &&
                status === "all"
                  ? "Mulai dengan menambahkan post pertama Anda"
                  : "Coba ubah filter pencarian Anda atau reset filter"}
              </p>
              {meta.totalCount === 0 &&
              !search &&
              type === "all" &&
              status === "all" ? (
                <PostsActions />
              ) : (
                <Link href="/dashboard/artikel">
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
                      <TableHead>Tipe</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Gambar</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead className="w-[150px] text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {post.body.length > 100
                                ? `${post.body.substring(0, 100)}...`
                                : post.body}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Slug: {post.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(post.type)}>
                            {post.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(post.status)}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {post.imageUrls?.length || 0}
                            </span>
                            {post.imageUrls && post.imageUrls.length > 0 && (
                              <div className="flex -space-x-1 ml-2">
                                {post.imageUrls
                                  .slice(0, 3)
                                  .map((url, index) => (
                                    <div
                                      key={index}
                                      className="w-6 h-6 rounded border-2 border-white overflow-hidden"
                                    >
                                      <Image
                                        src={getImageUrl(url)}
                                        alt={`Image ${index + 1}`}
                                        width={24}
                                        height={24}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                {post.imageUrls.length > 3 && (
                                  <div className="w-6 h-6 rounded border-2 border-white bg-gray-100 flex items-center justify-center">
                                    <span className="text-xs text-gray-600">
                                      +{post.imageUrls.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              title="Edit Post"
                            >
                              <Link href={`/dashboard/artikel/edit/${post.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DeletePostButton
                              postId={post.id}
                              postTitle={post.title}
                            />
                            {post.status === "PUBLISHED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                title="Lihat Post"
                              >
                                <Link
                                  href={`/artikel/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <PostsPagination
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
