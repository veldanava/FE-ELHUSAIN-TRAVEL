import Image from "next/image";

export default function Carousel() {
  return (
    <div className="w-full">
      <Image
        src="/banner-elhusain.png"
        alt="El Husain Travel Banner"
        width={1920}
        height={500}
        className="w-full"
        priority
      />
    </div>
  );
}
