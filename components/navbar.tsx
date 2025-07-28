// components/navbar.tsx (atau file Navbar Anda)

"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader, // <-- Import SheetHeader
  SheetTitle, // <-- Import SheetTitle
  SheetDescription, // <-- Import SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigationItems = [
    { href: "/", label: "Beranda" },
    { href: "/about", label: "Tentang Elhusain.Travel" },
    { href: "/paket", label: "Paket Elhusain" },
    { href: "/artikel", label: "Artikel & Blog" },
    { href: "/visa", label: "Visa" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo-elhusain.png"
                alt="El Husain Travel Logo"
                width={100}
                height={65}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-amber-800 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button className="bg-amber-800 hover:bg-amber-700 text-white">
              Hubungi Kami
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                {/* Tambahkan SheetHeader, SheetTitle, dan SheetDescription di sini */}
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>{" "}
                  {/* Judul yang dapat diakses */}
                  <SheetDescription className="sr-only">
                    Menu navigasi untuk situs Elhusain Travel.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Logo in sidebar */}
                  <div className="flex items-center mb-8">
                    <Link href="/">
                      {" "}
                      {/* Wrap Image with Link for clickability */}
                      <Image
                        src="/logo-elhusain.png"
                        alt="El Husain Travel Logo"
                        width={100}
                        height={65}
                        priority
                        className="h-12 w-auto"
                      />
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-800 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Contact Button in sidebar */}
                  <div className="mt-auto pt-4">
                    <Button className="w-full bg-amber-800 hover:bg-amber-700 text-white">
                      Hubungi Kami
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
