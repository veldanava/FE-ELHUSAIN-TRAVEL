import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      text: "Alhamdulillah, pengalaman umroh bersama El.Husain Travel sangat berkesan. Pelayanan yang ramah, pembimbing yang sabar, dan akomodasi yang nyaman membuat ibadah kami khusyuk.",
      name: "Ahmad Fauzi",
      role: "Jamaah Umroh 2023",
      image: "https://source.unsplash.com/50x50/?portrait?1",
    },
    {
      text: "Saya sangat puas dengan layanan El.Husain Travel. Semua diurus dengan profesional, mulai dari persiapan dokumen hingga pelaksanaan ibadah di tanah suci. Insya Allah akan kembali bersama keluarga.",
      name: "Siti Aminah",
      role: "Jamaah Umroh 2022",
      image: "https://source.unsplash.com/50x50/?portrait?2",
    },
    {
      text: "Pembimbing yang sangat membantu dan sabar dalam membimbing kami yang baru pertama kali umroh. Hotel dekat dengan Masjidil Haram sehingga memudahkan untuk beribadah. Terima kasih El.Husain Travel.",
      name: "Hasan Basri",
      role: "Jamaah Umroh 2023",
      image: "https://source.unsplash.com/50x50/?portrait?3",
    },
    {
      text: "Pelayanan terbaik, pembimbing yang kompeten, dan jadwal yang teratur membuat perjalanan umroh kami lancar dan berkesan. Semoga bisa berangkat lagi bersama El.Husain Travel.",
      name: "Fatimah Azzahra",
      role: "Jamaah Umroh 2022",
      image: "https://source.unsplash.com/50x50/?portrait?4",
    },
  ];

  return (
    <section className="bg-white">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid items-center gap-4 xl:grid-cols-5">
          <div className="max-w-2xl mx-auto my-8 space-y-4 text-center xl:col-span-2 xl:text-left">
            <h2 className="text-4xl font-bold text-gray-800">
              Kata Mereka yang Puas dengan El.Husain Travel
            </h2>
            <p className="text-gray-800">
              Beberapa testimoni dari mereka yang sudah menggunakan layanan
              elhusain
            </p>
          </div>
          <div className="p-6 xl:col-span-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid content-center gap-4">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-6 rounded shadow-md bg-base-100"
                  >
                    <p className="text-gray">{testimonial.text}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt=""
                        className="w-12 h-12 bg-center bg-cover rounded-full dark:bg-gray-500"
                        width={50}
                        height={50}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid content-center gap-4">
                {testimonials.slice(2, 4).map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-6 rounded shadow-md bg-base-100"
                  >
                    <p className="text-gray">{testimonial.text}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt=""
                        className="w-12 h-12 bg-center bg-cover rounded-full dark:bg-gray-500"
                        width={50}
                        height={50}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
