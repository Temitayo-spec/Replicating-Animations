"use client";

import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key, useEffect, useRef, useState } from "react";
import { useTransform, useScroll, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
  "/images/11.jpg",
  "/images/12.jpg",
] as string[];

const SmoothParallaxScroll: React.FC = () => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const container = useRef(null);
  const { height } = dimension;
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);
  return (
    <main className="grid place-items-center bg-[rgb(45,45,45)]">
      <div className="h-screen w-screen bg-[pink]"></div>
      <div
        ref={container}
        className="relative flex h-[175vh] gap-[2vw] overflow-hidden box-border p-[2vw]"
      >
        <Column
          images={[images[0], images[1], images[2]]}
          y={y}
          top="top-[-45%]"
        />
        <Column
          images={[images[3], images[4], images[5]]}
          y={y2}
          top="top-[-95%]"
        />
        <Column
          images={[images[6], images[7], images[8]]}
          y={y3}
          top="top-[-45%]"
        />
        <Column
          images={[images[9], images[10], images[11]]}
          y={y4}
          top="top-[-75%]"
        />
      </div>
      <div className="h-screen w-screen bg-[pink]"></div>
    </main>
  );
};

export default SmoothParallaxScroll;

const Column = ({
  images,
  y = 0,
  top,
}: {
  images: string[];
  y: any;
  top: string;
}) => {
  return (
    <motion.div
      style={{ y }}
      className={`relative flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] ${top}`}
    >
      {images.map(
        (src: string | StaticImport, index: Key | null | undefined) => (
          <div
            key={index}
            className="relative h-[350px] w-full overflow-hidden rounded-[1vw]"
          >
            <Image src={src} fill alt="image" className="object-cover" />
          </div>
        ),
      )}
    </motion.div>
  );
};
