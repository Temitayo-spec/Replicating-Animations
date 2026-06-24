"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

const PANELS = ["bg-[#57cea5]", "bg-[#063124]", "bg-[#0b5c43]", "bg-[#21ba80]"];
const SOCIALS = ["Bluesky", "Pinterest", "Youtube", "Instagram", "Linkedin", "X"];
const LEGAL = ["Cookie Policy", "Accessibility", "Data Rights", "Disclosures"];
const PRIMARY = ["Home", "Experiments", "Latest Updates", "Documentation", "Community"];
const SECONDARY = ["Playground", "Build Something", "Activity Feed", "Profile"];

const OverlayMenu = () => {
  const root = useRef<HTMLElement>(null);
  const panels = useRef<HTMLDivElement[]>([]);
  const sheet = useRef<HTMLDivElement>(null);
  const leftCol = useRef<HTMLDivElement>(null);
  const primaryCol = useRef<HTMLDivElement>(null);
  const secondaryCol = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const animating = useRef(false);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const splits = [leftCol, primaryCol, secondaryCol].map((col) =>
        SplitText.create(Array.from(col.current!.querySelectorAll("a")), {
          type: "lines",
          mask: "lines",
        }),
      );
      const lineGroups = splits.map((s) => s.lines);
      const allLines = lineGroups.flat();

      gsap.set(panels.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(allLines, { y: "100%" });

      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => (animating.current = false),
        onReverseComplete: () => {
          gsap.set(allLines, { y: "100%" });
          animating.current = false;
        },
      });

      timeline
        .to(panels.current, {
          scaleY: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .to(
          sheet.current,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
            ease: "power3.inOut",
          },
          "-=0.6",
        );

      lineGroups.forEach((lines) => {
        timeline.to(
          lines,
          { y: 0, duration: 0.75, stagger: 0.005, ease: "power3.out" },
          "-=0.4",
        );
      });

      tl.current = timeline;
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root },
  );

  const toggle = () => {
    if (animating.current) return;
    animating.current = true;
    const next = !openRef.current;
    openRef.current = next;
    setOpen(next);
    if (next) tl.current?.play();
    else tl.current?.reverse();
  };

  return (
    <main ref={root} className="bg-[#141414] font-onest">
      <nav className="fixed top-0 z-2 flex w-full items-center justify-between p-4">
        <a href="#" className="p-4" aria-label="Home">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
          </svg>
        </a>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex cursor-pointer flex-col items-center justify-center gap-[5px] border-none bg-transparent p-4"
        >
          <span
            className={`h-0.5 w-10 bg-white transition-all duration-400 ease-in-out ${
              open ? "translate-y-[3.5px] rotate-45 scale-x-75" : ""
            }`}
          />
          <span
            className={`h-0.5 w-10 bg-white transition-all duration-400 ease-in-out ${
              open ? "translate-y-[-3.5px] -rotate-45 scale-x-75" : ""
            }`}
          />
        </button>
      </nav>

      <div className="pointer-events-none absolute left-0 top-0 z-1 w-full max-[1000px]:h-svh">
        {PANELS.map((bg, i) => (
          <div
            key={bg}
            ref={(el) => {
              if (el) panels.current[i] = el;
            }}
            className={`absolute left-0 top-0 -z-10 h-full w-full will-change-transform ${bg}`}
          />
        ))}

        <div
          ref={sheet}
          className="flex gap-8 bg-[#084331] p-32 [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)] will-change-[clip-path] max-[1000px]:h-svh max-[1000px]:flex-col max-[1000px]:justify-center max-[1000px]:px-8 max-[1000px]:py-0"
        >
          <div ref={leftCol} className="flex flex-2 flex-col justify-between gap-8 max-[1000px]:flex-none">
            <div className="text-white">
              {SOCIALS.map((label) => (
                <a key={label} href="#" className="mb-2 block text-xl leading-[1.1] tracking-[-0.02em]">
                  {label}
                </a>
              ))}
            </div>
            <div className="text-[#318b6f] max-[1000px]:hidden">
              {LEGAL.map((label) => (
                <a key={label} href="#" className="mb-2 block text-[0.9rem] leading-[1.1] tracking-[-0.02em]">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-4 justify-between gap-8 max-[1000px]:flex-none">
            <div ref={primaryCol} className="text-white">
              {PRIMARY.map((label) => (
                <a key={label} href="#" className="mb-2 block text-5xl leading-[1.1] tracking-[-0.02em]">
                  {label}
                </a>
              ))}
            </div>
            <div ref={secondaryCol} className="text-white max-[1000px]:hidden">
              {SECONDARY.map((label) => (
                <a key={label} href="#" className="mb-2 block text-2xl leading-[1.1] tracking-[-0.02em]">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="relative h-svh w-full bg-[url(/hero.jpg)] bg-cover bg-center" />
    </main>
  );
};

export default OverlayMenu;
