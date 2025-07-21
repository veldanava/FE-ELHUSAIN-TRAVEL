"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import type {
  AdminUser,
  CreateAdminUserData,
  UpdateAdminUserData,
} from "@/hooks/use-admins";

interface AdminUserFormProps {
  user?: AdminUser | null;
  onSubmit: (data: CreateAdminUserData | UpdateAdminUserData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const roleOptions = [
  { value: "SUPER", label: "Super" },
  { value: "NORMAL", label: "Normal" },
];

export function AdminUserForm({
  user: editUser,
  onSubmit,
  onCancel,
  isLoading,
}: AdminUserFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "NORMAL",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editUser) {
      setFormData({
        email: editUser.email,
        password: "", // Don't pre-fill password for security
        role: editUser.role,
      });
    } else {
      setFormData({
        email: "",
        password: "",
        role: "NORMAL",
      });
    }
  }, [editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editUser) {
      // For updates, password is optional
      const updateData: UpdateAdminUserData = {
        email: formData.email,
        role: formData.role,
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await onSubmit(updateData);
    } else {
      // For creation, password is required
      const createData: CreateAdminUserData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      await onSubmit(createData);
    }
  };

  const isFormValid = () => {
    if (!formData.email.trim() || !formData.role) {
      return false;
    }

    // For new users, password is required
    if (!editUser && !formData.password.trim()) {
      return false;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="admin@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password {editUser ? "(Kosongkan jika tidak ingin mengubah)" : "*"}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder={
              editUser ? "Masukkan password baru" : "Masukkan password"
            }
            required={!editUser}
            disabled={isLoading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {!editUser && (
          <p className="text-xs text-muted-foreground">
            Password minimal 8 karakter, mengandung huruf besar, kecil, angka,
            dan simbol
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editUser ? "Mengupdate..." : "Menyimpan..."}
            </>
          ) : editUser ? (
            "Update"
          ) : (
            "Simpan"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
