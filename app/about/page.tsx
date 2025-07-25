import type { Metadata } from "next";
import PublicLayout from "@/components/public-layout";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Users,
  Calendar,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami - Elhusain Travel",
  description:
    "Mengenal lebih dekat El.Husain Travel - Bismillah Khidmat Haramain",
};

export default function AboutPage() {
  const achievements = [
    {
      icon: Users,
      label: "5,000+ Jamaah",
      description: "Telah melayani ribuan jamaah",
    },
    {
      icon: Calendar,
      label: "2+ Tahun",
      description: "Pengalaman di bidang travel haji & umroh",
    },
    {
      icon: Award,
      label: "Berlisensi Resmi",
      description: "Terdaftar di Kementerian Agama RI",
    },
    {
      icon: Star,
      label: "Rating 4.8/5",
      description: "Kepuasan jamaah adalah prioritas kami",
    },
  ];

  const services = [
    {
      title: "Umroh Reguler",
      description:
        "Paket umroh dengan fasilitas standar yang nyaman dan terjangkau",
      features: [
        "Hotel bintang 4",
        "Transportasi AC",
        "Makan 3x sehari",
        "Pembimbing berpengalaman",
      ],
    },
    {
      title: "Umroh Plus",
      description:
        "Paket umroh dengan destinasi tambahan untuk pengalaman yang lebih lengkap",
      features: [
        "Wisata Turki/Aqsa",
        "Hotel bintang 5",
        "City tour",
        "Dokumentasi profesional",
      ],
    },
    {
      title: "Haji Furoda",
      description:
        "Layanan haji dengan fasilitas premium dan pelayanan eksklusif",
      features: [
        "Hotel dekat Haram",
        "Katering Indonesia",
        "Pembimbing 24 jam",
        "Layanan VIP",
      ],
    },
  ];

  const team = [
    {
      name: "Test",
      position: "Direktur Utama",
      experience: "2+ tahun pengalaman",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Test",
      position: "Manager Operasional",
      experience: "1+ tahun pengalaman",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Test",
      position: "Pembimbing Ibadah",
      experience: "1+ tahun pengalaman",
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  return (
    <PublicLayout>
      <div className="bg-gray-50 mt-12">
        {/* Hero Section */}
        <div className="bg-amber-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Tentang El.Husain Travel
              </h1>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                Bismillah Khidmat Haramain - Melayani perjalanan ibadah Anda
                dengan sepenuh hati sejak 2023
              </p>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Visi & Misi Kami
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-amber-800 mb-3">
                    Visi
                  </h3>
                  <p className="text-gray-700">
                    Menjadi perusahaan travel haji dan umroh terpercaya yang
                    memberikan pelayanan terbaik dalam memfasilitasi perjalanan
                    ibadah umat Islam ke tanah suci.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-800 mb-3">
                    Misi
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2"></div>
                      <span>
                        Memberikan pelayanan haji dan umroh yang berkualitas
                        dengan harga terjangkau
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2"></div>
                      <span>
                        Memastikan kenyamanan dan keamanan jamaah selama
                        perjalanan ibadah
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2"></div>
                      <span>
                        Memberikan bimbingan ibadah yang sesuai dengan syariat
                        Islam
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-800 rounded-full mt-2"></div>
                      <span>
                        Membangun kepercayaan melalui transparansi dan
                        profesionalisme
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="El.Husain Travel Office"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pencapaian Kami
              </h2>
              <p className="text-lg text-gray-600">
                Kepercayaan jamaah adalah kebanggaan kami
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <achievement.icon className="h-12 w-12 text-amber-800 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {achievement.label}
                    </h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600">
              Berbagai pilihan paket sesuai kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-800">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-amber-800 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tim Kami
              </h2>
              <p className="text-lg text-gray-600">
                Profesional berpengalaman yang siap melayani Anda
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-amber-800 font-medium mb-2">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-600">{member.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-amber-800 rounded-lg p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Hubungi Kami</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-amber-200" />
                    <span>
                      Banyumas, Desa/Kelurahan Karangdadap, Kec. Kalibagor, Kab.
                      Banyumas, Provinsi Jawa Tengah
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-amber-200" />
                    <span>+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-amber-200" />
                    <span>info@elhusaintravel.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-200" />
                    <span>Senin - Jumat: 08:00 - 17:00 WIB</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Mengapa Memilih Kami?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-200 rounded-full mt-2"></div>
                    <span>Berlisensi resmi dari Kementerian Agama RI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-200 rounded-full mt-2"></div>
                    <span>Pembimbing berpengalaman dan berlisensi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-200 rounded-full mt-2"></div>
                    <span>Fasilitas hotel dan transportasi berkualitas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-200 rounded-full mt-2"></div>
                    <span>Harga transparan tanpa biaya tersembunyi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-200 rounded-full mt-2"></div>
                    <span>Layanan 24/7 selama perjalanan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
