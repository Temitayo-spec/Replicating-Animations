import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import { readSource } from "@/lib/source";
import ShockwaveSlider from "./ShockwaveSlider";

const files = [
  readSource("src/app/shockwave-content-slider/ShockwaveSlider.tsx"),
  readSource("src/app/shockwave-content-slider/shaders.ts", "shaders.ts", "tsx"),
];

const Page = () => (
  <CodeShowcase files={files}>
    <ShockwaveSlider />
  </CodeShowcase>
);

export default Page;
