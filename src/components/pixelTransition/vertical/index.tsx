'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const anim = {
  hidden: {
    opacity: 0,
  },
  open: (delays: number[]) => ({
    opacity: 1,
    transition: {
      duration: 0,
      delay: 0.02 * delays[1],
    },
  }),
  closed: (delays: number[]) => ({
    opacity: 0,
    transition: {
      duration: 0,
      delay: 0.02 * delays[0],
    },
  }),
};

const PixelBackgroundVertical = ({ isOpen }: { isOpen: boolean }) => {
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

  const getBlocks = (indexOfRow: number) => {
    const { innerWidth, innerHeight } = window;
    const blockSize = innerHeight * 0.1;
    const amountOfBlocks = Math.ceil(innerWidth / blockSize);
    const shuffledIndexes = shuffle(
      Array.from({ length: amountOfBlocks }, (_, i) => i)
    );
    return shuffledIndexes.map((randomIndex, index) => {
      return (
        <motion.div
          key={index}
          className="h-full w-[10vw] bg-yellow-300"
          variants={anim}
          initial="initial"
          animate={isOpen ? 'open' : 'closed'}
          custom={[indexOfRow + randomIndex, 10 - randomIndex + indexOfRow]}
        />
      );
    });
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden flex-col">
      {isClient &&
        Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-[10vh] w-screen flex">
            {getBlocks(i)}
          </div>
        ))}
    </div>
  );
};

export default PixelBackgroundVertical;
