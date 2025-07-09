"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminData {
  adminId: number;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  admin: AdminData | null;
  login: (adminData: AdminData) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("adminToken");
    const adminId = localStorage.getItem("adminId");
    const email = localStorage.getItem("adminEmail");
    const role = localStorage.getItem("adminRole");

    if (token && adminId && email && role) {
      setAdmin({
        adminId: Number.parseInt(adminId),
        email,
        role,
        token,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (adminData: AdminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminToken", adminData.token);
    localStorage.setItem("adminId", adminData.adminId.toString());
    localStorage.setItem("adminEmail", adminData.email);
    localStorage.setItem("adminRole", adminData.role);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
