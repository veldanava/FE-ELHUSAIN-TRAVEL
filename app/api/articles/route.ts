import { NextResponse } from "next/server";

// Mock data for articles
const articles = [
  {
    id: 1,
    title: "Persiapan Sebelum Berangkat Umroh",
    slug: "persiapan-sebelum-berangkat-umroh",
    excerpt:
      "Panduan lengkap persiapan fisik, mental, dan perlengkapan sebelum berangkat umroh",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    date: "2023-05-15",
    author: "Ustadz Ahmad",
    categoryId: 1,
    isPublished: true,
    createdAt: "2023-05-15T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
  },
  {
    id: 2,
    title: "Tata Cara Umroh yang Benar",
    slug: "tata-cara-umroh-yang-benar",
    excerpt:
      "Penjelasan detail tentang rukun dan tata cara umroh sesuai sunnah",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    date: "2023-06-20",
    author: "Ustadz Mahmud",
    categoryId: 1,
    isPublished: true,
    createdAt: "2023-06-20T10:30:00Z",
    updatedAt: "2023-06-20T10:30:00Z",
  },
  {
    id: 3,
    title: "Ziarah di Madinah",
    slug: "ziarah-di-madinah",
    excerpt:
      "Tempat-tempat bersejarah yang direkomendasikan untuk diziarahi di Madinah",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    date: "2023-07-10",
    author: "Ustadzah Fatimah",
    categoryId: 2,
    isPublished: true,
    createdAt: "2023-07-10T09:15:00Z",
    updatedAt: "2023-07-10T09:15:00Z",
  },
  {
    id: 4,
    title: "Doa-doa Mustajab di Tanah Suci",
    slug: "doa-doa-mustajab-di-tanah-suci",
    excerpt:
      "Kumpulan doa-doa yang dianjurkan dibaca di tempat-tempat mustajab di tanah suci",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    date: "2023-08-05",
    author: "Ustadz Hasan",
    categoryId: 3,
    isPublished: true,
    createdAt: "2023-08-05T11:45:00Z",
    updatedAt: "2023-08-05T11:45:00Z",
  },
  {
    id: 5,
    title: "Tips Menjaga Kesehatan Selama Umroh",
    slug: "tips-menjaga-kesehatan-selama-umroh",
    excerpt:
      "Cara menjaga kesehatan dan stamina selama menjalankan ibadah umroh",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    date: "2023-09-12",
    author: "dr. Aminah",
    categoryId: 4,
    isPublished: true,
    createdAt: "2023-09-12T14:20:00Z",
    updatedAt: "2023-09-12T14:20:00Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 5;
  const page = Number(searchParams.get("page")) || 1;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedArticles = articles.slice(start, end);

  return NextResponse.json({
    message: "Articles retrieved successfully",
    meta: {
      page,
      limit,
      count: articles.length,
    },
    data: paginatedArticles,
  });
}
