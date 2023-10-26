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
      delay: 0.02 * delays[0],
    },
  }),
  closed: (delays: number[]) => ({
    opacity: 0,
    transition: {
      duration: 0,
      delay: 0.02 * delays[1],
    },
  }),
};

const PixelBackgroundHorizontal = ({ isOpen }: { isOpen: boolean }) => {
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

  const getBlocks = (indexOfColumn: number) => {
    if (typeof window !== 'undefined') {
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
            custom={[
              indexOfColumn + randomIndex,
              20 - randomIndex + indexOfColumn,
            ]}
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
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className={styles.column}>
          {getBlocks(i)}
        </div>
      ))}
    </div>
  );
};

export default PixelBackgroundHorizontal;
