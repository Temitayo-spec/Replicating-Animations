import fs from 'node:fs';
import path from 'node:path';
import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import SplitVignette from './SplitVignette';

const source = fs.readFileSync(
  path.join(process.cwd(), 'src/app/split-vignette/SplitVignette.tsx'),
  'utf8',
);

const Page = () => (
  <CodeShowcase code={source} filename="SplitVignette.tsx" language="tsx">
    <SplitVignette />
  </CodeShowcase>
);

export default Page;
