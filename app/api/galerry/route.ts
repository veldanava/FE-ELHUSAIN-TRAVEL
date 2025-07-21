import { NextResponse } from "next/server";

// Mock data for gallery images
const galleryImages = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Kaaba di Masjidil Haram",
    displayOrder: 1,
    createdAt: "2023-01-10T08:00:00Z",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Masjid Nabawi di Madinah",
    displayOrder: 2,
    createdAt: "2023-01-11T09:30:00Z",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Pemandangan Kota Mekah",
    displayOrder: 3,
    createdAt: "2023-01-12T10:15:00Z",
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Jamaah Umrah El.Husain Travel",
    displayOrder: 4,
    createdAt: "2023-01-13T11:45:00Z",
  },
  {
    id: 5,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Jamaah Haji di Arafah",
    displayOrder: 5,
    createdAt: "2023-01-14T13:20:00Z",
  },
  {
    id: 6,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Air Zamzam",
    displayOrder: 6,
    createdAt: "2023-01-15T14:10:00Z",
  },
  {
    id: 7,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Gunung Uhud",
    displayOrder: 7,
    createdAt: "2023-01-16T15:30:00Z",
  },
  {
    id: 8,
    imageUrl: "/placeholder.svg?height=180&width=180",
    title: "Masjid Quba",
    displayOrder: 8,
    createdAt: "2023-01-17T16:45:00Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 8;
  const page = Number(searchParams.get("page")) || 1;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedImages = galleryImages.slice(start, end);

  return NextResponse.json({
    message: "Gallery images retrieved successfully",
    meta: {
      page,
      limit,
      count: galleryImages.length,
    },
    data: paginatedImages,
  });
}
