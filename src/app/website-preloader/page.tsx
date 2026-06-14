import fs from 'node:fs';
import path from 'node:path';
import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import Preloader from './Preloader';

const source = fs.readFileSync(
  path.join(process.cwd(), 'src/app/website-preloader/Preloader.tsx'),
  'utf8',
);

const Page = () => (
  <CodeShowcase code={source} filename="Preloader.tsx" language="tsx">
    <Preloader />
  </CodeShowcase>
);

export default Page;
