// components/dashboard/image-with-fallback.tsx
"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Props extends Omit<ImageProps, "onError"> {
  fallbackSrc: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = useState<string | StaticImport>(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
