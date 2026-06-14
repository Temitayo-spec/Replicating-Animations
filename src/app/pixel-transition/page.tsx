import fs from 'node:fs';
import path from 'node:path';
import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import PixelTransition from './PixelTransition';

const source = fs.readFileSync(
  path.join(process.cwd(), 'src/app/pixel-transition/PixelTransition.tsx'),
  'utf8',
);

const Page = () => (
  <CodeShowcase code={source} filename="PixelTransition.tsx" language="tsx">
    <PixelTransition />
  </CodeShowcase>
);

export default Page;
