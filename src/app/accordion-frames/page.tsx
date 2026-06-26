import fs from "node:fs";
import path from "node:path";
import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import Spotlight from "@/app/accordion-frames/Spotlight";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/accordion-frames/Spotlight.tsx"),
  "utf8",
);

const Page = () => (
  <CodeShowcase code={source} filename="Spotlight.tsx" language="tsx">
    <Spotlight />
  </CodeShowcase>
);

export default Page;
