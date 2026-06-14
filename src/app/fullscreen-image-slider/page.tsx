import fs from 'node:fs';
import path from 'node:path';
import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import FullscreenSlider from './FullscreenSlider';

const source = fs.readFileSync(
  path.join(process.cwd(), 'src/app/fullscreen-image-slider/FullscreenSlider.tsx'),
  'utf8',
);

const Page = () => (
  <CodeShowcase code={source} filename="FullscreenSlider.tsx" language="tsx">
    <FullscreenSlider />
  </CodeShowcase>
);

export default Page;
