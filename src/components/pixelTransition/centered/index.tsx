'use client';
import styles from './style.module.css';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const anim = {
  hidden: {
    opacity: 0,
  },
  open: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0,
      delay: 0.02 * i,
    },
  }),
  closed: (i: number) => ({
    opacity: 0,
    transition: {
      duration: 0,
      delay: 0.02 * i,
    },
  }),
};

const PixelBackgroundCentered = ({ isOpen }: { isOpen: boolean }) => {
  const shuffle = (a: any[]) => {
    var j, x, i;

    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));

      x = a[i];

      a[i] = a[j];

      a[j] = x;
    }

    return a;
  };

  const getBlocks = () => {
    const { innerWidth, innerHeight } = window;
    const blockSize = innerWidth * 0.05;
    const amountOfBlocks = Math.ceil(innerHeight / blockSize);
    const shuffledIndexes = shuffle(
      Array.from({ length: amountOfBlocks }, (_, i) => i)
    );
    return shuffledIndexes.map((randomIndex, index) => {
      return (
        <motion.div
          key={index}
          className={styles.block}
          variants={anim}
          initial="initial"
          animate={isOpen ? 'open' : 'closed'}
          custom={randomIndex}
        />
      );
    });
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.pixelBackground}>
      {isClient &&
        Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={styles.column}>
            {getBlocks()}
          </div>
        ))}
    </div>
  );
};

export default PixelBackgroundCentered;
