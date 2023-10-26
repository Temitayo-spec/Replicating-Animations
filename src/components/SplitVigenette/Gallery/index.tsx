import Image from 'next/image';
import styles from './style.module.css';
import { MotionValue, motion } from 'framer-motion';

const Gallery = ({
  mousePosition,
  handle,
}: {
  mousePosition: {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
  handle: string;
}) => {
  const { x, y } = mousePosition;
  return (
    <div className={styles.gallery}>
      <div className={styles.imageContainer}>
        <Image src={`/images/${handle}/background.jpg`} alt="image" fill />
      </div>

      <motion.div className={styles.vignette} style={{ x, y }}>
        <Image src={`/images/${handle}/1.jpg`} alt="image" fill />
      </motion.div>
    </div>
  );
};

export default Gallery;
