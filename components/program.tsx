import Image from "next/image";

export default function Program() {
  const equipmentItems = [
    "Koper Bagasi & Koper Kabin",
    "Tas Kabin, Tas Paspor, Tas Bandal",
    "Godybag",
    "Kain Ihram",
    "Buku Panduan Umroh",
    "Syal",
    "Tali IDCard",
    "Bantal Leher",
    "Sabuk Ihram",
  ];

  return (
    <div className="hero bg-[url('/hero.png')]">
      <div className="hero-content flex-col lg:flex-row">
        <div className="w-100 shadow-sm">
          <figure>
            <Image
              src="/alat.png"
              alt="Peralatan Haji & Umroh"
              width={400}
              height={400}
            />
          </figure>
        </div>
        <div className="h-[530px]">
          <Image
            src="/logo-elhusain.png"
            alt="El Husain Travel Logo"
            width={195}
            height={90}
          />
          <h1 className="font-bold text-[20px]">
            Kami Menjual dan Menyediakan Set Peralatan Haji & Umroh:
          </h1>
          <ul className="steps steps-vertical">
            {equipmentItems.map((item, index) => (
              <li key={index} className="step step-warning">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
