import fs from 'node:fs';
import path from 'node:path';
import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import ParallaxScroll from './ParallaxScroll';

const source = fs.readFileSync(
  path.join(process.cwd(), 'src/app/smooth-parallax-scroll/ParallaxScroll.tsx'),
  'utf8',
);

const Page = () => (
  <CodeShowcase code={source} filename="ParallaxScroll.tsx" language="tsx">
    <ParallaxScroll />
  </CodeShowcase>
);

export default Page;
