'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Key, useEffect, useRef, useState } from 'react';
import { useTransform, useScroll, motion } from 'framer-motion';
import { MotionValue } from 'framer-motion/dom';
import Lenis from '@studio-freight/lenis';

const images = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
  '/images/9.jpg',
  '/images/10.jpg',
  '/images/11.jpg',
  '/images/12.jpg',
] as string[];

const SmoothParallaxScroll: React.FC = () => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const container = useRef(null);
  const { height } = dimension;
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
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

    window.addEventListener('resize', resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);
  return (
    <main className={styles.main}>
      <div className={styles.spacer}></div>
      <div ref={container} className={styles.gallery}>
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} />
      </div>
      <div className={styles.spacer}></div>
    </main>
  );
};

export default SmoothParallaxScroll;

const Column = ({ images, y = 0 }: { images: string[]; y: any }) => {
  return (
    <motion.div style={{ y }} className={styles.column}>
      {images.map(
        (src: string | StaticImport, index: Key | null | undefined) => (
          <div key={index} className={styles.imageContainer}>
            <Image src={src} fill alt="image" />
          </div>
        )
      )}
    </motion.div>
  );
};
