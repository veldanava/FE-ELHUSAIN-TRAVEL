import { NextResponse } from "next/server";

// Mock data for tour packages
const tourPackages = [
  {
    id: 1,
    title: "Umrah Reguler 9 Hari",
    slug: "umrah-reguler-9-hari",
    shortDescription:
      "Paket umrah reguler selama 9 hari dengan akomodasi hotel bintang 4",
    fullDescription:
      "Paket umrah reguler selama 9 hari dengan akomodasi hotel bintang 4 di Makkah dan Madinah. Termasuk tiket pesawat, visa, transportasi, dan makan 3x sehari.",
    price: 25000000,
    duration: "9 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 1,
    isActive: true,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-01-15T08:00:00Z",
    category: {
      id: 1,
      name: "Umrah Reguler",
      slug: "umrah-reguler",
    },
  },
  {
    id: 2,
    title: "Umrah Plus Turki 12 Hari",
    slug: "umrah-plus-turki-12-hari",
    shortDescription: "Paket umrah plus wisata ke Turki selama 12 hari",
    fullDescription:
      "Paket umrah plus wisata ke Turki selama 12 hari. Mengunjungi tempat-tempat bersejarah di Istanbul dan Bursa. Termasuk tiket pesawat, visa, transportasi, dan makan 3x sehari.",
    price: 35000000,
    duration: "12 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 2,
    isActive: true,
    createdAt: "2023-02-20T10:30:00Z",
    updatedAt: "2023-02-20T10:30:00Z",
    category: {
      id: 2,
      name: "Umrah Plus",
      slug: "umrah-plus",
    },
  },
  {
    id: 3,
    title: "Haji Furoda 2024",
    slug: "haji-furoda-2024",
    shortDescription:
      "Paket haji furoda untuk tahun 2024 dengan akomodasi premium",
    fullDescription:
      "Paket haji furoda untuk tahun 2024 dengan akomodasi premium. Termasuk tiket pesawat, visa, transportasi, dan makan 3x sehari. Hotel bintang 5 di Makkah dan Madinah.",
    price: 150000000,
    duration: "30 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 3,
    isActive: true,
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
    category: {
      id: 3,
      name: "Haji Furoda",
      slug: "haji-furoda",
    },
  },
  {
    id: 4,
    title: "Umrah Ramadhan 2024",
    slug: "umrah-ramadhan-2024",
    shortDescription: "Paket umrah spesial Ramadhan 2024 selama 15 hari",
    fullDescription:
      "Paket umrah spesial Ramadhan 2024 selama 15 hari. Merasakan pengalaman ibadah di bulan suci Ramadhan di tanah suci. Termasuk tiket pesawat, visa, transportasi, dan makan 3x sehari.",
    price: 30000000,
    duration: "15 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 1,
    isActive: true,
    createdAt: "2023-04-05T11:45:00Z",
    updatedAt: "2023-04-05T11:45:00Z",
    category: {
      id: 1,
      name: "Umrah Reguler",
      slug: "umrah-reguler",
    },
  },
  {
    id: 5,
    title: "Umrah Plus Aqsa 14 Hari",
    slug: "umrah-plus-aqsa-14-hari",
    shortDescription:
      "Paket umrah plus ziarah ke Masjid Al-Aqsa selama 14 hari",
    fullDescription:
      "Paket umrah plus ziarah ke Masjid Al-Aqsa selama 14 hari. Mengunjungi tempat-tempat bersejarah di Yerusalem. Termasuk tiket pesawat, visa, transportasi, dan makan 3x sehari.",
    price: 40000000,
    duration: "14 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 2,
    isActive: true,
    createdAt: "2023-05-12T14:20:00Z",
    updatedAt: "2023-05-12T14:20:00Z",
    category: {
      id: 2,
      name: "Umrah Plus",
      slug: "umrah-plus",
    },
  },
  {
    id: 6,
    title: "Umrah Ekonomis 9 Hari",
    slug: "umrah-ekonomis-9-hari",
    shortDescription:
      "Paket umrah ekonomis selama 9 hari dengan harga terjangkau",
    fullDescription:
      "Paket umrah ekonomis selama 9 hari dengan harga terjangkau. Akomodasi hotel bintang 3 di Makkah dan Madinah. Termasuk tiket pesawat, visa, transportasi, dan makan 2x sehari.",
    price: 22000000,
    duration: "9 hari",
    mainImageUrl: "/placeholder.svg?height=300&width=400",
    categoryId: 1,
    isActive: true,
    createdAt: "2023-06-18T16:10:00Z",
    updatedAt: "2023-06-18T16:10:00Z",
    category: {
      id: 1,
      name: "Umrah Reguler",
      slug: "umrah-reguler",
    },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedPackages = tourPackages.slice(start, end);

  return NextResponse.json({
    message: "Tour packages retrieved successfully",
    meta: {
      page,
      limit,
      count: tourPackages.length,
    },
    data: paginatedPackages,
  });
}
