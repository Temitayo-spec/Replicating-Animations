import styles from './style.module.css';

import { motion } from 'framer-motion';

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
  /**

     * Shuffles array in place (Fisher–Yates shuffle).

     * @param {Array} a items An array containing the items.

     */

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
    if (typeof window !== 'undefined') {
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
            className={styles.block}
            variants={anim}
            initial="initial"
            animate={isOpen ? 'open' : 'closed'}
            custom={[indexOfRow + randomIndex, 10 - randomIndex + indexOfRow]}
          />
        );
      });
    } else {
      // Return a placeholder or handle the case where `window` is not available.
      return null;
    }
  };

  return (
    <div className={styles.pixelBackground}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={styles.row}>
          {getBlocks(i)}
        </div>
      ))}
    </div>
  );
};

export default PixelBackgroundVertical;
