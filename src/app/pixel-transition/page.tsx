import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import { readSource } from '@/lib/source';
import PixelTransition from './PixelTransition';

const files = [
  readSource('src/app/pixel-transition/PixelTransition.tsx'),
  readSource('src/components/pixelTransition/centered/index.tsx', 'PixelBackgroundCentered.tsx'),
  readSource('src/components/pixelTransition/horizontal/index.tsx', 'PixelBackgroundHorizontal.tsx'),
  readSource('src/components/pixelTransition/vertical/index.tsx', 'PixelBackgroundVertical.tsx'),
];

const Page = () => (
  <CodeShowcase files={files}>
    <PixelTransition />
  </CodeShowcase>
);

export default Page;
