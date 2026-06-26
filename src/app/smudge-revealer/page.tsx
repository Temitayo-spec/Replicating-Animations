import CodeShowcase from "@/components/CodeShowcase/CodeShowcase";
import { readSource } from "@/lib/source";
import SmudgeRevealer from "./SmudgeRevealer";

const files = [readSource("src/app/smudge-revealer/SmudgeRevealer.tsx")];

const Page = () => (
  <CodeShowcase files={files}>
    <SmudgeRevealer />
  </CodeShowcase>
);

export default Page;
