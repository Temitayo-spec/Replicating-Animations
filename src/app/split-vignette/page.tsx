'use client';
import Gallery from '@/components/SplitVigenette/Gallery';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { useMotionValue, useSpring } from 'framer-motion';

const projects = [
  {
    name: 'Dyal Thak',
    handle: 'dyal_thak',
  },
  {
    name: 'Leidinger Matthias',
    handle: 'leidinger_matthias',
  },
  {
    name: 'Mark Rammers',
    handle: 'mark_rammers',
  },
  {
    name: 'Landon Speers',
    handle: 'landon_speers',
  },
];

const SplitVignette = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };
  const mousePosiiton = {
    x: useSpring(0, spring),
    y: useSpring(0, spring),
  };

  const mouseMove = (e: { clientX: number; clientY: number }) => {
    if (typeof window !== undefined) {
      const { clientX, clientY } = e;
      const targetX = clientX - (window.innerWidth / 2) * 0.25;
      const targetY = clientY - (window.innerHeight / 2) * 0.6;
      mousePosiiton.x.set(targetX);
      mousePosiiton.y.set(targetY);
    } else return null;
  };
  return (
    <main className={styles.main} onMouseMove={mouseMove}>
      {projects.map(({ handle }, i) => {
        return (
          <Gallery mousePosition={mousePosiiton} handle={handle} key={i} />
        );
      })}
    </main>
  );
};

export default SplitVignette;
