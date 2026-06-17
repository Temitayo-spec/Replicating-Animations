import CodeShowcase from '@/components/CodeShowcase/CodeShowcase';
import { readSource } from '@/lib/source';
import SplitVignette from './SplitVignette';

const files = [
  readSource('src/app/split-vignette/SplitVignette.tsx'),
  readSource('src/components/SplitVigenette/Gallery/index.tsx', 'Gallery.tsx'),
];

const Page = () => (
  <CodeShowcase files={files}>
    <SplitVignette />
  </CodeShowcase>
);

export default Page;
