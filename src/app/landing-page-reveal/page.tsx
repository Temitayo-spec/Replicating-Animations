import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import { readSource } from "@/lib/source";
import LandingPageReveal from "./LandingPageReveal";

const files = [readSource("src/app/landing-page-reveal/LandingPageReveal.tsx")];

const Page = () => (
  <CodeShowcase files={files}>
    <LandingPageReveal />
  </CodeShowcase>
);

export default Page;
