"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Search,
  Eye,
  ImageIcon,
} from "lucide-react";
import {
  usePosts,
  type Post,
  type CreatePostData,
  type UpdatePostData,
} from "@/hooks/use-article";
import { PostForm } from "@/components/post-form";
import Image from "next/image";

export default function PostsPage() {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000";

  const {
    posts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    // fetchPosts, // Removed because fetchPosts does not exist
    createPost,
    updatePost,
    deletePost,
  } = usePosts(filters) as unknown as {
    posts: Post[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: number | null;
    createPost: (data: CreatePostData) => Promise<void>;
    updatePost: (id: number, data: UpdatePostData) => Promise<void>;
    deletePost: (id: number) => Promise<void>;
  };

  const handleCreate = async (data: CreatePostData | UpdatePostData) => {
    // Ensure required fields for CreatePostData are present
    if (!data.title) {
      // Optionally show an error or return early
      return;
    }
    try {
      await createPost(data as CreatePostData);
      setIsDialogOpen(false);
      setEditingPost(null);
    } catch {
      // Error handled in hook or intentionally ignored
    }
  };

  const handleUpdate = async (data: UpdatePostData) => {
    if (!editingPost) return;

    try {
      await updatePost(editingPost.id, data);
      setIsDialogOpen(false);
      setEditingPost(null);
    } catch {
      // Error handled in hook
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus post ini?")) return;
    await deletePost(id);
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleRefresh = () => {
    // If your hook supports refetching, call it here. Otherwise, update filters to trigger reload.
    setFilters({ ...filters });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? "" : value };
    setFilters(newFilters);
  };

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

  // Filter posts by search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Kelola blog, artikel, dan konten lainnya
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Post" : "Tambah Post"}
                </DialogTitle>
                <DialogDescription>
                  {editingPost ? "Update informasi post" : "Buat post baru"}
                </DialogDescription>
              </DialogHeader>
              <PostForm
                post={editingPost}
                onSubmit={editingPost ? handleUpdate : handleCreate}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isCreating || isUpdating}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.type || "all"}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="BLOG">Blog</SelectItem>
                <SelectItem value="NEWS">News</SelectItem>
                <SelectItem value="CATALOG">Catalog</SelectItem>
                <SelectItem value="INFORMATION">Information</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center md:justify-start">
              <span className="text-sm text-gray-600">
                {filteredPosts.length} posts ditemukan
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Posts</CardTitle>
          <CardDescription>Total {filteredPosts.length} posts</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada posts</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Post Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
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
                            {post.imageUrls.slice(0, 3).map((url, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded border-2 border-white overflow-hidden"
                              >
                                <Image
                                  src={
                                    `${IMAGE_BASE_URL}${url}` ||
                                    "/placeholder.svg"
                                  }
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                        >
                          {isDeleting === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        {post.status === "PUBLISHED" && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
