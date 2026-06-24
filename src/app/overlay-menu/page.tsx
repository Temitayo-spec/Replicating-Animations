import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import { readSource } from "@/lib/source";
import OverlayMenu from "./OverlayMenu";

const files = [readSource("src/app/overlay-menu/OverlayMenu.tsx")];

const Page = () => (
  <CodeShowcase files={files}>
    <OverlayMenu />
  </CodeShowcase>
);

export default Page;
