export type Animation = {
  slug: string;
  title: string;
  blurb: string;
  stack: string;
};

// Single source of truth for the landing page and the global nav menu.
export const animations: Animation[] = [
  {
    slug: 'detriot-paris-inifinite-slider',
    title: 'Always Arriving',
    blurb: 'An endless, drag-anywhere image slider where slides grow exponentially across the screen and recycle forever.',
    stack: 'Vanilla + RAF',
  },
  {
    slug: 'fullscreen-image-slider',
    title: 'Fullscreen Slider',
    blurb: 'An infinite, clip-path wipe between full-bleed paintings, with metadata columns that scroll in lockstep.',
    stack: 'GSAP',
  },
  {
    slug: 'shockwave-content-slider',
    title: 'Shockwave Slider',
    blurb: 'A WebGL ripple that shockwaves across the screen to crossfade between slides, with masked text swapping in sync.',
    stack: 'Three.js + GSAP',
  },
  {
    slug: 'accordion-frames',
    title: 'Accordion Frames',
    blurb: 'A spotlight accordion of thin frames that ease open on hover, with a focus marker tracing the active panel.',
    stack: 'React + CSS',
  },
  {
    slug: 'pixel-transition',
    title: 'Pixel Transition',
    blurb: 'A pixelated reveal that tiles the viewport and animates in from the centre, horizontal or vertical.',
    stack: 'React + CSS',
  },
  {
    slug: 'smooth-parallax-scroll',
    title: 'Parallax Scroll',
    blurb: 'A buttery, Lenis-smoothed scroll with images drifting at offset speeds for depth.',
    stack: 'Framer Motion + Lenis',
  },
  {
    slug: 'split-vignette',
    title: 'Split Vignette',
    blurb: 'A split gallery that parts around a hovered project, easing apart with spring physics.',
    stack: 'Framer Motion + Lenis',
  },
  {
    slug: 'website-preloader',
    title: 'Website Preloader',
    blurb: 'A staged loading sequence that wipes away to reveal the page beneath it.',
    stack: 'GSAP',
  },
];
