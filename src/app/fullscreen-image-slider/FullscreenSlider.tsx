'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './page.module.css';

type Slide = { image: string; name: string; year: string };

const SLIDES: Slide[] = [
  { image: 'birmingham-museums-trust.jpg', name: 'Near Glarus', year: '1781' },
  { image: 'adrianna-geo.jpg', name: 'Palace of Versailles', year: '1829' },
  { image: 'the-path-by-lake.jpg', name: 'The Path By The Lake', year: '1836' },
  { image: 'paradise-street-towards-christ-church.jpg', name: 'Paradise Street', year: '1840' },
  { image: 'battle-of-the-pyramids.jpg', name: 'Battle of the Pyramids', year: '1845' },
];

// Clip-path rectangles used to wipe slides in and out.
const CLIP = {
  full: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  bottom: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
  top: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
};

const LINE = 30; // px height of one metadata row (matches the CSS clip window)
const REPEAT = 3; // metadata columns are tripled so they can loop seamlessly
const DURATION = 1.6;

const FullScreenImageSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const prefixRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = Array.from(
      slider.querySelectorAll<HTMLElement>('[data-slide]'),
    );
    const images = slides.map((s) => s.querySelector('img'));
    const columns = [prefixRef.current, namesRef.current, yearsRef.current];

    const N = SLIDES.length;
    const LOOP = N * LINE;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduce ? 0 : DURATION;

    // Initial state: first slide on top and revealed, the rest clipped away.
    slides.forEach((slide, i) =>
      gsap.set(slide, { clipPath: i === 0 ? CLIP.full : CLIP.bottom, zIndex: i === 0 ? 1 : 0 }),
    );
    images.forEach((img, i) => img && gsap.set(img, { scale: i === 0 ? 1 : 2 }));
    // Park the (tripled) columns on the middle copy so they can scroll either way.
    gsap.set(columns, { y: -LOOP });

    let index = 0;
    let columnY = -LOOP;
    let topZ = 1;
    let animating = false;

    const step = (dir: 1 | -1) => {
      if (animating) return;
      animating = true;

      const target = (index + dir + N) % N;
      const from = index;
      const incoming = slides[target];
      const outgoing = slides[from];
      const incomingImg = images[target];
      const outgoingImg = images[from];

      // Always reveal the incoming slide on top with a directional wipe — this
      // is what makes wrap-around seamless (no reliance on neighbour order).
      topZ += 1;
      gsap.set(incoming, { zIndex: topZ });
      columnY += dir === 1 ? -LINE : LINE;
      const targetY = columnY;

      const tl = gsap.timeline({
        onComplete: () => {
          // The slide we left is now fully covered — reset it for reuse.
          gsap.set(outgoing, { clipPath: CLIP.bottom });
          if (outgoingImg) gsap.set(outgoingImg, { scale: 2 });

          // Re-centre the looped columns on the middle copy (visually identical).
          if (columnY <= -2 * LOOP) columnY += LOOP;
          else if (columnY > -LOOP) columnY -= LOOP;
          if (columnY !== targetY) gsap.set(columns, { y: columnY });

          index = target;
          animating = false;
        },
      });

      tl.to(columns, { y: targetY, duration, ease: 'power4.inOut' }, 0);
      tl.fromTo(
        incoming,
        { clipPath: dir === 1 ? CLIP.bottom : CLIP.top },
        { clipPath: CLIP.full, duration, ease: 'power4.inOut' },
        0,
      );
      if (incomingImg) {
        tl.fromTo(
          incomingImg,
          { scale: 2 },
          { scale: 1, duration, ease: 'power3.inOut' },
          0,
        );
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (animating) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Columns are tripled so the scroll can loop without a visible jump.
  const looped = Array.from({ length: REPEAT }, () => SLIDES).flat();

  return (
    <>
      <div className={styles.slider__content}>
        <div className={styles.slide__number}>
          <div className={styles.prefix} ref={prefixRef}>
            {looped.map((_, i) => (
              <div key={i}>{(i % SLIDES.length) + 1}</div>
            ))}
          </div>
          <div className={styles.postfix}>
            <span>/</span> {SLIDES.length}
          </div>
        </div>
        <div className={styles.slide__name}>
          <div className={styles.names} ref={namesRef}>
            {looped.map((slide, i) => (
              <div key={i}>{slide.name}</div>
            ))}
          </div>
        </div>
        <div className={styles.slide__year}>
          <div className={styles.years} ref={yearsRef}>
            {looped.map((slide, i) => (
              <div key={i}>{slide.year}</div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.slider} ref={sliderRef}>
        {SLIDES.map((slide, i) => (
          <div
            className={styles.slide}
            key={slide.image}
            data-slide
            style={i === 0 ? { clipPath: CLIP.full } : undefined}
          >
            <Image
              src={`/images/${slide.image}`}
              alt={slide.name}
              width={1920}
              height={1080}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FullScreenImageSlider;
