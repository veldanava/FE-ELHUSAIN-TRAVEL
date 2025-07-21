/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/UsersPage.tsx (atau komponen serupa)
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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Shield,
  User,
  Crown,
} from "lucide-react";
import {
  useAdmins,
  type AdminUser,
  type CreateAdminUserData,
  type UpdateAdminUserData,
} from "@/hooks/use-admins";
import { AdminUserForm } from "@/components/dashboard/admin-form";
import { useAuth } from "@/lib/auth-context";

export default function UsersPage() {
  const {
    users,
    isLoading, // Dari TanStack Query
    isCreating, // Dari TanStack Query
    isUpdating, // Dari TanStack Query
    isDeleting, // Dari TanStack Query
    fetchAdmins, // Sekarang adalah refetch dari useQuery
    createAdmin,
    updateAdmin,
    deleteAdmin,
  } = useAdmins();
  const { admin: currentAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const handleCreate = async (
    data: CreateAdminUserData | UpdateAdminUserData
  ) => {
    if (!data.email) {
      alert("Email is required.");
      return;
    }
    try {
      // panggil createAdmin dari useAdmins hook yang sekarang menggunakan useMutation
      await createAdmin(data as CreateAdminUserData);
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      // Error handling sudah di dalam hook, jadi tidak perlu lagi di sini
    }
  };

  const handleUpdate = async (data: UpdateAdminUserData) => {
    if (!editingUser) return;

    try {
      // panggil updateAdmin dari useAdmins hook
      await updateAdmin({ id: editingUser.id, data }); // Kirim objek dengan id dan data
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      // Error handling sudah di dalam hook
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Prevent self-deletion
    if (currentAdmin?.adminId === id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri!");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus admin user ini?")) return;
    try {
      await deleteAdmin(id);
    } catch (error) {
      // Error handling sudah di dalam hook
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchAdmins(); // Sekarang memanggil refetch dari TanStack Query
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "super":
        return <Crown className="h-4 w-4" />;
      case "normal":
        return <User className="h-4 w-4" />; // Menggunakan User icon untuk Normal
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "super":
        return "destructive" as const;
      case "normal":
        return "default" as const;
      default:
        return "secondary" as const;
    }
  };

  // Ensure users is always an array
  const safeUsers = Array.isArray(users)
    ? users.filter((user) => user != null)
    : [];

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
                  <Skeleton className="h-12 w-12 rounded-full" />
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
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">
            Kelola admin users dan permissions
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
                Tambah Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit Admin User" : "Tambah Admin User"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Update informasi admin user"
                    : "Buat admin user baru"}
                </DialogDescription>
              </DialogHeader>
              <AdminUserForm
                user={editingUser}
                onSubmit={editingUser ? handleUpdate : handleCreate}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isCreating || isUpdating} // isCreating/isUpdating dari TanStack Query
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Admin Users</CardTitle>
              <CardDescription>
                Total {safeUsers.length} admin users
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure Access Management</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {safeUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada admin users</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Admin Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getRoleIcon(user.role || "Normal")}
                        </div>
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role ? (
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="flex items-center gap-1"
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt || "")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={
                            isDeleting === user.id ||
                            currentAdmin?.adminId === user.id
                          }
                        >
                          {isDeleting === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
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
