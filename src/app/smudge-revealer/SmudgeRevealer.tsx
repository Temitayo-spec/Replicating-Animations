"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const config = {
  smoothing: 0.1,
  movementThreshold: 0.01,
  stampSpacing: 14,
  sizeFromSpeed: 0.2,
  expandMultiplier: 2,
  expandTime: 2,
  expandEase: "power1.inOut",
  dissolveStart: 2,
  dissolveTime: 3,
  dissolveEase: "power3.in",
};

const SmudgeRevealer = () => {
  const heroRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const blobsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const svg = svgRef.current;
    const blobs = blobsRef.current;
    if (!hero || !svg || !blobs) return;

    const pointer = { x: 0, y: 0 };
    const smoothPointer = { x: 0, y: 0 };
    const lastStamp = { x: 0, y: 0 };
    let hasStarted = false;
    let hasStamped = false;
    let rafId = 0;

    const onPointerMove = (x: number, y: number) => {
      if (!hasStarted) {
        pointer.x = smoothPointer.x = x;
        pointer.y = smoothPointer.y = y;
        hasStarted = true;
        return;
      }
      pointer.x = x;
      pointer.y = y;
    };

    const onMouseMove = (e: MouseEvent) => onPointerMove(e.pageX, e.pageY);
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
    };
    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("touchstart", onTouchStart, { passive: false });

    const matchSVGToViewport = () => {
      svg.style.width = `${window.innerWidth}px`;
      svg.style.height = `${window.innerHeight}px`;
    };
    matchSVGToViewport();
    window.addEventListener("resize", matchSVGToViewport);

    const stampSmudgeAt = (x: number, y: number, radius: number) => {
      const blob = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      blob.setAttribute("cx", String(x));
      blob.setAttribute("cy", String(y));
      blob.setAttribute("r", String(radius));
      blob.setAttribute("fill", "#fff");
      blobs.prepend(blob);

      const animatedRadius = { current: radius };
      const tl = gsap.timeline({
        onUpdate() {
          blob.setAttribute("r", String(Math.max(0, animatedRadius.current)));
        },
        onComplete() {
          tl.kill();
          blob.remove();
        },
      });

      tl.to(animatedRadius, {
        current: radius * config.expandMultiplier,
        duration: config.expandTime,
        ease: config.expandEase,
      }).to(
        animatedRadius,
        {
          current: 0,
          duration: config.dissolveTime,
          ease: config.dissolveEase,
        },
        config.dissolveStart,
      );
    };

    const update = () => {
      if (hasStarted) {
        smoothPointer.x += (pointer.x - smoothPointer.x) * config.smoothing;
        smoothPointer.y += (pointer.y - smoothPointer.y) * config.smoothing;

        const speed = Math.hypot(
          pointer.x - smoothPointer.x,
          pointer.y - smoothPointer.y,
        );

        const travelled = Math.hypot(
          smoothPointer.x - lastStamp.x,
          smoothPointer.y - lastStamp.y,
        );
        if (
          speed > config.movementThreshold &&
          (!hasStamped || travelled >= config.stampSpacing)
        ) {
          stampSmudgeAt(
            smoothPointer.x,
            smoothPointer.y,
            speed * config.sizeFromSpeed,
          );
          lastStamp.x = smoothPointer.x;
          lastStamp.y = smoothPointer.y;
          hasStamped = true;
        }
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", matchSVGToViewport);
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <main>
      <section ref={heroRef} className="relative h-svh w-full overflow-hidden">
        <div className="absolute inset-0 flex select-none items-end justify-center bg-[#2a2b2a] p-8 text-center text-[#edf2ed]">
          <h1 className="font-['Anton'] text-[clamp(5rem,22.5vw,30rem)] uppercase leading-[0.9]">
            Dig in
          </h1>
        </div>

        <div
          className="absolute inset-0 flex select-none items-center justify-center bg-[#cbd4c2] p-8 text-center text-[#323332]"
          style={{ mask: "url(#smudge-mask)", WebkitMask: "url(#smudge-mask)" }}
        >
          <h3 className="font-['Anton'] text-[clamp(3rem,5vw,6rem)] uppercase leading-[0.9]">
            The things worth finding are never on the surface. They live in the
            part you almost scrolled past.
          </h3>
        </div>
      </section>

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-0"
      >
        <defs>
          <filter id="smudge-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -14"
            />
          </filter>
        </defs>
        <mask id="smudge-mask">
          <g ref={blobsRef} filter="url(#smudge-goo)" />
        </mask>
      </svg>
    </main>
  );
};

export default SmudgeRevealer;
