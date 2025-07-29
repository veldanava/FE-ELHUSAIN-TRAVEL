import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer md:pl-25 md:pr-25 bg-amber-800 sm:footer-horizontal text-white text-base-content p-10">
      <aside>
        <Image
          src="/logo-elhusain.png"
          alt="El Husain Travel Logo"
          width={150}
          height={80}
        />
        <p className="w-80">
          Kami adalah Perusahaan yang bergerak di bidang Jasa Umrah & Haji, Jasa
          Land Arrangement Saudi, Provider Visa Umrah & Haji Furoda, Paket Umrah
          Plus, Paket Haji Furoda dan Paket Haji Khusus. Sebuah perusahaan
          travel yang berkepentingan di Negara yang berpusat di Kingdom of Saudi
          Arabia.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Navigasi</h6>
        <ul>
          <li className="pb-2">
            <Link href="/">Beranda</Link>
          </li>
          <li className="pb-2">
            <Link href="/about">Tentang Elhusain.Travel</Link>
          </li>
          <li className="pb-2">
            <Link href="/paket">Paket Elhusain</Link>
          </li>
          <li className="pb-2">
            <Link href="/detail">Artikel & Blog</Link>
          </li>
          {/* <li className="pb-2">
            <Link href="/visa">Visa</Link>
          </li> */}
        </ul>
      </nav>
      <nav>
        <h6 className="footer-title">Kantor El.Husain Travel</h6>
        <a className="text-white w-55">
          Banyumas, Desa/Kelurahan Karangdadap, Kec, Kalibagor, Kab, Banyumas,
          Provinsi Jawa Tengah
        </a>
      </nav>
      <nav id="contact">
        <h6 className="footer-title">Kontak Info</h6>
        <a className="text-white">0808080</a>
        <a className="text-white">loremipsum@gmail.com</a>
        <h6 className="footer-title">Rekening Bank Lorem:</h6>
        <a className="text-white">a.n El.Husain Travel</a>
      </nav>
    </footer>
  );
}
