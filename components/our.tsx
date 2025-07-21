import {
  StickyNoteIcon as NoteSticky,
  Users,
  BookOpen,
  MapPin,
  Star,
  Home,
} from "lucide-react";

export default function Our() {
  const features = [
    {
      title: "Terpercaya",
      description:
        "Kami telah melayani ribuan jamaah dengan pengalaman yang memuaskan",
      icon: NoteSticky,
    },
    {
      title: "Sesuai Syariat Islam",
      description:
        "Semua kegiatan dan layanan kami sesuai dengan syariat Islam",
      icon: BookOpen,
    },
    {
      title: "Kajian Agama",
      description:
        "Dilengkapi dengan kajian agama dari ustadz yang berpengalaman",
      icon: Star,
    },
    {
      title: "Muthawif dan Tim lapangan adalah orang indonesia",
      description: "Memudahkan komunikasi dan pemahaman kebutuhan jamaah",
      icon: Users,
    },
    {
      title: "Pembimbing Yang Profesional",
      description:
        "Pembimbing berpengalaman yang akan memandu selama perjalanan",
      icon: MapPin,
    },
    {
      title: "Fasilitas Nyaman",
      description:
        "Hotel, transportasi, dan fasilitas lainnya yang nyaman dan berkualitas",
      icon: Home,
    },
  ];

  return (
    <div className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[20px] font-bold md:ml-20">
              Mengapa memilih El.Husain Travel
            </h1>
            <h1 className="md:ml-20">
              Kami mengutamakan kemudahan agar ibadah terasa nyaman
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-3 p-4 lg:flex-row lg:items-stretch lg:flex-wrap">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 w-96 shadow-sm">
              <figure className="px-10 pt-10">
                <feature.icon className="h-12 w-12 text-amber-800" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
