import type { Metadata } from "next";
import FloatingButton from "@/components/floating-button";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Carousel from "@/components/carousel";
import Catalogue from "@/components/catalogue";
import Our from "@/components/our";
import Program from "@/components/program";
import Testimonials from "@/components/testimonials";
import Photo from "@/components/photo";
import Article from "@/components/article";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Beranda - Elhusain Travel",
  description: "Bismillah Khidmat Haramain",
};

export default function Home() {
  return (
    <div>
      <FloatingButton />
      <Navbar />
      <Hero />
      <Carousel />
      <Catalogue />
      <Our />
      <Program />
      <Testimonials />
      <Photo />
      <Article />
      <Footer />
    </div>
  );
}
