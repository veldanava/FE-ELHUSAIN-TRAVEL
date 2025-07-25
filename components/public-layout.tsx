"use client";

import type React from "react";
import FloatingButton from "@/components/floating-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingButton />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
