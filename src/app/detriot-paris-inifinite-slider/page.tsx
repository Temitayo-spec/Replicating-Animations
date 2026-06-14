import fs from "node:fs";
import path from "node:path";
import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import Slider from "./Slider";

// Read the component's own source at build time so the "View code" panel always
// shows the real, up-to-date implementation — no hand-maintained snippet.
const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/detriot-paris-inifinite-slider/Slider.tsx"),
  "utf8",
);

const Page = () => {
  return (
    <CodeShowcase code={source} filename="Slider.tsx" language="tsx">
      <Slider />
    </CodeShowcase>
  );
};

export default Page;
