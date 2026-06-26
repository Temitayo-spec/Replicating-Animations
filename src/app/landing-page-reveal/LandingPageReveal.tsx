"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, SplitText, CustomEase);

const IMAGES = [
  "/images/leidinger_matthias/background.jpg",
  "/images/landon_speers/background.jpg",
  "/images/mark_rammers/background.jpg",
  "/images/dyal_thak/background.jpg",
  "/images/9.jpg",
];
const ROTATIONS = [-15, 5, -7.5, 10, -2.5];
const SCALE = 0.2;
const GAP = 40;

const LandingPageReveal = () => {
  const root = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const imgs = useRef<HTMLDivElement[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      CustomEase.create("hop", "0.9, 0, 0.1, 1");
      CustomEase.create("glide", "0.8, 0, 0.2, 1");

      const vw = window.innerWidth;
      const imgW = vw * SCALE;
      const rowW = imgW * 5 + GAP * 4;
      const centeredStart = (vw - rowW) / 2;
      const offStart = centeredStart - vw * 1.3;

      const centered: number[] = [];
      imgs.current.forEach((img, i) => {
        centered[i] = centeredStart + i * (imgW + GAP) + imgW / 2 - vw / 2;
        const off = offStart + i * (imgW + GAP) + imgW / 2 - vw / 2;
        gsap.set(img, {
          scale: SCALE,
          x: off,
          rotate: ROTATIONS[i],
          borderRadius: "2.5rem",
        });
      });

      const splitOpts = {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      } as const;
      const navSplit = SplitText.create(
        navRef.current!.querySelectorAll("a"),
        splitOpts,
      );
      const headerSplit = SplitText.create(
        headerRef.current!.querySelectorAll("h1"),
        splitOpts,
      );
      const socialSplit = SplitText.create(
        socialRef.current!.querySelectorAll("p, a"),
        splitOpts,
      );

      gsap.set([navSplit.lines, headerSplit.lines, socialSplit.lines].flat(), {
        y: "125%",
      });
      gsap.set(bar.current, { scaleX: 0, transformOrigin: "left" });

      const tl = gsap.timeline({ delay: 1 });

      tl.to(bar.current, {
        scaleX: 1,
        duration: 1.5,
        ease: "glide",
        onComplete: () => gsap.set(bar.current, { transformOrigin: "right" }),
      });
      tl.to(bar.current, { scaleX: 0, duration: 1.5, ease: "hop" });

      tl.to(
        overlay.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "<0.75",
      );

      imgs.current.forEach((img, i) => {
        tl.to(img, { x: centered[i], duration: 1.5, ease: "glide" }, "<0.025");
      });

      tl.addLabel("spread");
      tl.to(
        [imgs.current[0], imgs.current[1]],
        { x: "-100vw", duration: 1.5, ease: "glide" },
        "spread",
      );
      tl.to(
        [imgs.current[3], imgs.current[4]],
        { x: "100vw", duration: 1.5, ease: "glide" },
        "spread",
      );
      tl.to(
        imgs.current[2],
        {
          scale: 1,
          x: 0,
          rotation: 0,
          borderRadius: 0,
          duration: 1.5,
          ease: "glide",
        },
        "<",
      );

      tl.to(
        navSplit.lines,
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "spread+=1.3",
      );
      tl.to(
        headerSplit.lines,
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "spread+=1.3",
      );
      tl.to(
        socialSplit.lines,
        { y: "0%", duration: 1, stagger: 0.1, ease: "power3.out" },
        "spread+=1.55",
      );

      return () => {
        navSplit.revert();
        headerSplit.revert();
        socialSplit.revert();
      };
    },
    { scope: root },
  );

  return (
    <main ref={root} className="font-dm-sans text-white">
      <div
        ref={overlay}
        className="fixed top-0 z-10 h-svh w-full bg-[#0f0f0f] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"
      >
        <div
          ref={bar}
          className="absolute top-0 h-2 w-full origin-left bg-white will-change-transform"
        />
      </div>

      <nav
        ref={navRef}
        className="fixed top-0 z-2 flex w-full items-start justify-between p-8"
      >
        <div>
          <a href="#" className="block tracking-[-0.01em]">
            Foundry &amp; Form <br /> Industrial Design Consultancy
          </a>
        </div>
        <div className="flex gap-16 max-[1000px]:flex-col max-[1000px]:items-end max-[1000px]:gap-0">
          <a href="#" className="block tracking-[-0.01em]">
            Work
          </a>
          <a href="#" className="block tracking-[-0.01em]">
            Catalogue
          </a>
          <a href="#" className="block tracking-[-0.01em]">
            About
          </a>
        </div>
      </nav>

      <section className="relative h-svh w-full overflow-hidden">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              if (el) imgs.current[i] = el;
            }}
            className="absolute left-0 top-0 h-full w-full overflow-hidden will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}

        <div className="absolute left-0 top-0 z-2 flex h-svh w-full flex-col justify-between px-8 py-[15svh] max-[1000px]:pb-8">
          <div ref={headerRef} className="w-3/5 max-[1000px]:w-full">
            <h1 className="text-[3rem] font-normal leading-[1.1] tracking-[-0.01em]">
              We design objects that carry the weight of their own conviction,
              where every curve and joint exists not for beauty but because the
              material demanded it.
            </h1>
          </div>

          <div ref={socialRef}>
            <p className="block tracking-[-0.01em]">Say Hello</p>
            <a href="#" className="block tracking-[-0.01em]">
              info@foundryandform.com
            </a>
            <a href="#" className="block tracking-[-0.01em]">
              View Enquiries
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPageReveal;
