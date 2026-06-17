import Image from 'next/image';
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
    <div className="h-[120vh] [clip-path:polygon(0_0,0_100%,100%_100%,100%_0)]">
      <div className="w-full h-full relative">
        <Image
          src={`/images/${handle}/background.jpg`}
          alt="image"
          fill
          className="object-cover w-full"
        />
      </div>

      <motion.div
        className="h-[30vw] w-[25vw] fixed top-0 left-0"
        style={{ x, y }}
      >
        <Image
          src={`/images/${handle}/1.jpg`}
          alt="image"
          fill
          className="rounded-[20px] object-cover w-full"
        />
      </motion.div>
    </div>
  );
};

export default Gallery;
