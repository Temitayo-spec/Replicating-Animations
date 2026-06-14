"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const config = {
  totalSlides: 12,
  lerp: 0.075,
  scrollSpeed: 3.5,
  minSize: 0.1,
  growth: 0.25,
  aspect: 1 / 1.25,
  baseline: 0.0,
};

type SlideInfo = {
  title: string;
  location: string;
  year: string;
  description: string;
};

// Editorial metadata shown when a slide is expanded.
const SLIDE_DATA: SlideInfo[] = [
  { title: "Crimson Hour", location: "Osaka, JP", year: "2023", description: "A figure caught between stillness and the next step — the city exhaling neon into the dusk." },
  { title: "Electric Pulse", location: "Shibuya, JP", year: "2022", description: "Light bends around the crowd, every face lit by a screen that never sleeps." },
  { title: "Night Circuit", location: "Akihabara, JP", year: "2023", description: "Signage stacked like memory — a thousand stories competing for a single glance." },
  { title: "Quiet Velocity", location: "Nagano, JP", year: "2021", description: "Stillness is just motion holding its breath before the descent." },
  { title: "Concrete Bloom", location: "Berlin, DE", year: "2022", description: "An empty lot reclaimed by colour, a mural blooming where nothing was meant to grow." },
  { title: "Vermilion Drift", location: "Kyoto, JP", year: "2023", description: "Red is not a colour here, it is a temperature — the warmth of a moment passing." },
  { title: "Steel Garden", location: "Tokyo, JP", year: "2022", description: "Wires overhead like vines, the rooftops a canopy of antennae and ambition." },
  { title: "After Rain", location: "Sapporo, JP", year: "2021", description: "The street holds the sky in its puddles, doubling the world for anyone slow enough to look." },
  { title: "Midnight Index", location: "Shinjuku, JP", year: "2023", description: "Numbers, names, departures — the architecture of a city that measures itself in light." },
  { title: "Soft Machine", location: "Yokohama, JP", year: "2022", description: "Precision rendered tender — the hard edge of engineering softened by the hour." },
  { title: "Paper Lantern", location: "Nara, JP", year: "2021", description: "A glow that remembers older nights, carried forward into the rush of the new." },
  { title: "Perpetual", location: "—", year: "2024", description: "The lineup never ends; every image is the next, and the next is always arriving." },
];

type DetailState = {
  image: number;
  rect: DOMRect;
  el: HTMLElement;
};

const Slider = () => {
  const sliderRef = useRef<HTMLElement>(null);
  const frozenRef = useRef(false);
  const [detail, setDetail] = useState<DetailState | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const growthRatio = Math.exp(config.growth);

    const slideCount = Math.ceil(
      Math.log(1 + (growthRatio - 1) / config.minSize) / config.growth + 4,
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lerpFactor = reduceMotion ? 1 : config.lerp;

    const wrap = (value: number, max: number) => ((value % max) + max) % max;
    const edgeX = (position: number, width: number) =>
      (width * config.minSize * (Math.pow(growthRatio, position) - 1)) /
      (growthRatio - 1);

    const slides: HTMLDivElement[] = [];
    const slideStreamIndex: number[] = [];

    for (let i = 0; i < slideCount; i++) {
      const slide = document.createElement("div");
      slide.className =
        "absolute left-0 bottom-0 overflow-hidden origin-bottom-left will-change-transform cursor-pointer";

      const img = document.createElement("img");
      img.className = "w-full h-full object-cover block pointer-events-none";
      img.decoding = "async";
      img.draggable = false;
      img.alt = "";
      slide.appendChild(img);

      slider.appendChild(slide);
      slides.push(slide);
      slideStreamIndex.push(i);
    }

    function setSlideImage(slide: HTMLDivElement, imageNumber: number) {
      if (slide.dataset.image === String(imageNumber)) return;
      slide.dataset.image = String(imageNumber);
      const img = slide.querySelector("img");
      if (img) img.src = `/images/${imageNumber}.jpg`;
    }

    // Cached dimensions — updated only on resize, not every frame.
    let viewWidth = 0;
    let viewHeight = 0;
    let baseWidth = 1; // the size each slide is rendered at before scaling down

    function measure() {
      viewWidth = slider!.clientWidth;
      viewHeight = slider!.clientHeight;
      // Render slides at the largest size they'll reach (a touch beyond the
      // viewport so the rightmost, partially-visible slide never upscales),
      // then scale DOWN with the GPU — sharp and layout-free.
      baseWidth = Math.ceil(viewWidth * growthRatio) || 1;
      const baseHeight = baseWidth / config.aspect;
      for (const slide of slides) {
        slide.style.width = `${baseWidth}px`;
        slide.style.height = `${baseHeight}px`;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      measure();
      layout();
    });
    resizeObserver.observe(slider);
    measure();

    let scroll = 0;
    let scrollTarget = 0;
    let running = false;
    let rafId = 0;

    // Position every slide for the current `scroll`. No layout-triggering
    // properties here — only transform + zIndex (both compositor-friendly).
    function layout() {
      const baselineOffset = viewHeight * config.baseline;

      for (let i = 0; i < slideCount; i++) {
        const slide = slides[i];
        let streamIndex = slideStreamIndex[i];

        while (edgeX(streamIndex + scroll, viewWidth) > viewWidth)
          streamIndex -= slideCount;
        while (edgeX(streamIndex + scroll + 1, viewWidth) < 0)
          streamIndex += slideCount;

        slideStreamIndex[i] = streamIndex;

        const left = edgeX(streamIndex + scroll, viewWidth);
        const right = edgeX(streamIndex + scroll + 1, viewWidth);
        const scale = (right - left) / baseWidth;

        setSlideImage(slide, wrap(streamIndex, config.totalSlides) + 1);

        slide.style.transform = `translate3d(${left}px, ${baselineOffset}px, 0) scale(${scale})`;
        slide.style.zIndex = String(Math.round(right));
      }
    }

    function render() {
      const delta = scrollTarget - scroll;

      // Settled: snap exactly, lay out one last frame, and stop the loop.
      if (Math.abs(delta) < 0.0001) {
        scroll = scrollTarget;
        layout();
        running = false;
        return;
      }

      scroll += delta * lerpFactor;
      layout();
      rafId = requestAnimationFrame(render);
    }

    // Restart the loop on input; it parks itself again once movement settles.
    function kick() {
      if (running || frozenRef.current) return;
      running = true;
      rafId = requestAnimationFrame(render);
    }

    // Expand the tapped slide into the fullscreen detail view.
    function openDetail(clientX: number, clientY: number) {
      const hit = document
        .elementFromPoint(clientX, clientY)
        ?.closest<HTMLElement>("[data-image]");
      if (!hit) return;

      frozenRef.current = true;
      cancelAnimationFrame(rafId);
      running = false;

      setDetail({
        image: Number(hit.dataset.image),
        rect: hit.getBoundingClientRect(),
        el: hit,
      });
    }

    const onWheel = (e: WheelEvent) => {
      if (frozenRef.current) return;
      e.preventDefault();
      scrollTarget += (e.deltaY + e.deltaX) * (config.scrollSpeed * 0.0014);
      kick();
    };
    slider.addEventListener("wheel", onWheel, { passive: false });

    let lastTouchX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (frozenRef.current) return;
      lastTouchX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (frozenRef.current || lastTouchX === null) return;

      const x = e.touches[0].clientX;
      scrollTarget += (lastTouchX - x) * (config.scrollSpeed * 0.004);
      lastTouchX = x;
      kick();
    };
    const onTouchEnd = () => {
      lastTouchX = null;
    };
    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchmove", onTouchMove, { passive: true });
    slider.addEventListener("touchend", onTouchEnd, { passive: true });

    // Pointer drag — and tap detection (a near-stationary press = open detail).
    let lastPointerX: number | null = null;
    let downX = 0;
    let downY = 0;
    let dragged = false;

    const onPointerDown = (e: PointerEvent) => {
      if (frozenRef.current) return;
      lastPointerX = e.clientX;
      downX = e.clientX;
      downY = e.clientY;
      dragged = false;
      slider.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (frozenRef.current || lastPointerX === null) return;

      const x = e.clientX;
      if (Math.hypot(x - downX, e.clientY - downY) > 6) dragged = true;
      scrollTarget += (lastPointerX - x) * (config.scrollSpeed * -0.005);
      lastPointerX = x;
      kick();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (lastPointerX !== null && !dragged && !frozenRef.current) {
        openDetail(e.clientX, e.clientY);
      }
      lastPointerX = null;
    };
    const onPointerCancel = () => {
      lastPointerX = null;
    };
    slider.addEventListener("pointerdown", onPointerDown);
    slider.addEventListener("pointermove", onPointerMove);
    slider.addEventListener("pointerup", onPointerUp);
    slider.addEventListener("pointercancel", onPointerCancel);

    // Initial paint.
    layout();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      slider.removeEventListener("wheel", onWheel);
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
      slider.removeEventListener("touchend", onTouchEnd);
      slider.removeEventListener("pointerdown", onPointerDown);
      slider.removeEventListener("pointermove", onPointerMove);
      slider.removeEventListener("pointerup", onPointerUp);
      slider.removeEventListener("pointercancel", onPointerCancel);
      slides.forEach((slide) => slide.remove());
    };
  }, []);

  return (
    <>
      <section
        ref={sliderRef}
        className="relative h-screen w-full cursor-grab touch-none overflow-hidden bg-[#edede7] active:cursor-grabbing"
      >
        <div className="pointer-events-none absolute left-12 top-12 z-[40]">
          <h1 className="w-1/2 font-['PP_Neue_Montreal'] text-[clamp(3rem,5vw,7rem)] font-medium leading-none tracking-[-0.02em]">
            Always Arriving
          </h1>
        </div>
      </section>

      {detail && (
        <SlideDetail
          image={detail.image}
          rect={detail.rect}
          el={detail.el}
          onClose={() => {
            frozenRef.current = false;
            setDetail(null);
          }}
        />
      )}
    </>
  );
};

const EXPAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const COLLAPSE_EASE = "cubic-bezier(0.7, 0, 0.84, 0)";

const SlideDetail = ({
  image,
  rect,
  el,
  onClose,
}: {
  image: number;
  rect: DOMRect;
  el: HTMLElement;
  onClose: () => void;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const closingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const data = SLIDE_DATA[(image - 1) % SLIDE_DATA.length];

  // Transform that maps the fullscreen image down onto the slide's rect.
  const startTransform: CSSProperties = {
    transform: `translate(${rect.left}px, ${rect.top}px) scale(${
      rect.width / window.innerWidth
    }, ${rect.height / window.innerHeight})`,
  };

  useLayoutEffect(() => {
    el.style.visibility = "hidden";
    const node = imgRef.current;
    if (!node) return;

    // FLIP: from the slide's rect up to fullscreen.
    const anim = node.animate(
      [startTransform as Keyframe, { transform: "translate(0px, 0px) scale(1, 1)" }],
      { duration: 720, easing: EXPAND_EASE, fill: "both" },
    );
    const reveal = setTimeout(() => setRevealed(true), 360);

    return () => {
      clearTimeout(reveal);
      anim.cancel();
      el.style.visibility = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setRevealed(false);

    const node = imgRef.current;
    if (!node) {
      onClose();
      return;
    }
    const anim = node.animate(
      [{ transform: "translate(0px, 0px) scale(1, 1)" }, startTransform as Keyframe],
      { duration: 560, easing: COLLAPSE_EASE, fill: "forwards" },
    );
    anim.onfinish = onClose;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden">
      {/* Expanding image (click to dismiss) */}
      <img
        ref={imgRef}
        src={`/images/${image}.jpg`}
        alt=""
        onClick={close}
        style={startTransform}
        className="absolute inset-0 h-full w-full origin-top-left cursor-zoom-out object-cover will-change-transform"
      />

      {/* Gradient scrim for text legibility */}
      <div
        onClick={close}
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-700 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Close button */}
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className={`absolute right-6 top-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition duration-500 hover:bg-white hover:text-black ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Editorial caption — masked reveal (text rises from behind a clip) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8 md:p-14 lg:p-16">
        <div className="max-w-2xl">
          {/* Metadata line */}
          <div className="mb-4 overflow-hidden">
            <div
              className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                revealed ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <span>{String(image).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-white/40" />
              <span>{data.location}</span>
              <span>{data.year}</span>
            </div>
          </div>

          {/* Title — word-by-word masked rise */}
          <h2 className="flex flex-wrap items-end gap-x-[0.22em] font-['PP_Neue_Montreal'] text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-white md:text-7xl">
            {data.title.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.2em]">
                <span
                  className={`inline-block transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    revealed ? "translate-y-0" : "translate-y-full"
                  }`}
                  style={{ transitionDelay: revealed ? `${120 + i * 70}ms` : "0ms" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* Description — masked block rise */}
          <div className="mt-4 max-w-xl overflow-hidden">
            <p
              className={`text-base leading-relaxed text-white/80 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:text-lg ${
                revealed ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ transitionDelay: revealed ? "280ms" : "0ms" }}
            >
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
