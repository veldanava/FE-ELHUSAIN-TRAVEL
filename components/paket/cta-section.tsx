"use client";

import { Button } from "../ui/button";

export default function CtaSection() {
  return (
    <div className="mt-16 bg-amber-800 rounded-lg p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">
        Tidak Menemukan Paket yang Sesuai?
      </h2>
      <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
        Hubungi tim kami untuk konsultasi gratis dan dapatkan paket yang
        disesuaikan dengan kebutuhan Anda
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          className="bg-white text-amber-800 hover:bg-gray-100"
          onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
        >
          Konsultasi via WhatsApp
        </Button>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-amber-800 bg-transparent"
          onClick={() => window.open("tel:+6281234567890")}
        >
          Telepon Sekarang
        </Button>
      </div>
    </div>
  );
}


// "use client";

// import { Button } from "@/components/ui/button";

// export default function CtaButtons() {
//   return (
//     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//       <Button
//         variant="secondary"
//         className="bg-white text-amber-800 hover:bg-gray-100"
//         onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
//       >
//         Konsultasi via WhatsApp
//       </Button>
//       <Button
//         variant="outline"
//         className="border-white text-white hover:bg-white hover:text-amber-800 bg-transparent"
//         onClick={() => window.open("tel:+6281234567890")}
//       >
//         Telepon Sekarang
//       </Button>
//     </div>
//   );
// }