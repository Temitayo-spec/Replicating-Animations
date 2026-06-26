"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

gsap.registerPlugin(SplitText);

type Slide = { title: string; description: string; image: string };

const SLIDES: Slide[] = [
  {
    title: "Blackwater '91",
    description:
      "Flickering lanterns and twisted masks welcome unwanted visitors into a strange celebration beyond the forest trail.",
    image: "/images/shockwave-0.jpg",
  },
  {
    title: "Crimson Theory",
    description:
      "As a brutalist concrete structure begins to crumble, the lines between architectural genius and psychological torment blur into a captivating nightmare.",
    image: "/images/shockwave-1.jpg",
  },
  {
    title: "Onyx Bloom",
    description:
      "Deep within a forgotten biome, bioluminescent flora casts an ethereal glow across a world where evolution took a dark and stunning turn.",
    image: "/images/shockwave-2.jpg",
  },
  {
    title: "Scarlet Idol",
    description:
      "Bathed in crimson light, a lone figure poses for a photograph no one will ever develop.",
    image: "/images/1.jpg",
  },
  {
    title: "Akihabara Dreaming",
    description:
      "A canyon of painted faces and glowing promises, where every wall is awake and watching.",
    image: "/images/4.jpg",
  },
  {
    title: "Fallen Titans",
    description:
      "Two warriors frozen mid-stride in the dirt, monuments to a battle the world forgot.",
    image: "/images/5.jpg",
  },
  {
    title: "Lantern Alley",
    description:
      "Tangled wires and paper lanterns line a backstreet that only exhales after dark.",
    image: "/images/9.jpg",
  },
  {
    title: "Quiet Crossing",
    description:
      "A single cyclist drifts through the stillness, the morning holding its breath.",
    image: "/images/7.jpg",
  },
];

const SLIDE_HTML = (slide: Slide) => `
  <div class="slide-title absolute left-12 top-1/2 w-max -translate-y-1/2 text-white max-[1000px]:left-1/2 max-[1000px]:-translate-x-1/2">
    <h1 class="text-[clamp(2rem,4vw,6rem)] font-medium leading-tight tracking-[-0.02em]">${slide.title}</h1>
  </div>
  <div class="slide-description absolute right-12 top-1/2 z-2 flex w-[15%] min-w-[250px] -translate-y-1/2 flex-col gap-8 text-white max-[1000px]:bottom-[5%] max-[1000px]:left-1/2 max-[1000px]:right-auto max-[1000px]:top-auto max-[1000px]:w-3/4 max-[1000px]:-translate-x-1/2 max-[1000px]:text-center">
    <p class="font-medium">${slide.description}</p>
  </div>
`;

const ShockwaveSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let cancelled = false;
    let rafId = 0;
    let detach = () => {};

    let currentIndex = 0;
    let isTransitioning = false;
    let rippleTween: gsap.core.Tween | null = null;

    const splitTitle = (container: HTMLElement) => {
      const heading = container.querySelector<HTMLElement>(".slide-title");
      if (!heading) return null;
      return new SplitText(heading, {
        type: "words, chars",
        mask: "chars",
        wordsClass: "word",
        charsClass: "char",
      });
    };

    const splitDescription = (container: HTMLElement) => {
      const lines: Element[] = [];
      container.querySelectorAll(".slide-description p").forEach((p) => {
        const split = SplitText.create(p, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
        });
        lines.push(...split.lines);
      });
      return lines;
    };

    const buildSlideContent = (slide: Slide) => {
      const el = document.createElement("div");
      el.className =
        "slide-content pointer-events-none absolute inset-0 z-[2] select-none mix-blend-difference";
      el.style.opacity = "0";
      el.innerHTML = SLIDE_HTML(slide);
      slider.appendChild(el);
      return el;
    };

    const animateTextOut = (container: HTMLElement) => {
      const titleSplit = splitTitle(container);
      const lines = splitDescription(container);
      const tl = gsap.timeline();

      if (titleSplit) {
        tl.to(titleSplit.chars, {
          y: "-100%",
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.inOut",
        });
      }
      tl.to(
        lines,
        { y: "-100%", duration: 0.6, stagger: 0.02, ease: "power2.inOut" },
        0.1,
      );
      return tl;
    };

    const animateTextIn = (container: HTMLElement) => {
      const titleSplit = splitTitle(container);
      const lines = splitDescription(container);
      const chars = titleSplit ? titleSplit.chars : [];

      gsap.set([chars, lines], { y: "100%" });
      gsap.set(container, { opacity: 1 });

      return gsap
        .timeline()
        .to(chars, {
          y: "0%",
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.inOut",
        })
        .to(
          lines,
          { y: "0%", duration: 0.5, stagger: 0.02, ease: "power2.inOut" },
          0.1,
        );
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    slider.prepend(renderer.domElement);

    (async () => {
      const textureLoader = new THREE.TextureLoader();
      const textures = await Promise.all(
        SLIDES.map(
          (slide) =>
            new Promise<THREE.Texture>((resolve, reject) =>
              textureLoader.load(slide.image, resolve, undefined, reject),
            ),
        ),
      );

      if (cancelled) {
        textures.forEach((t) => t.dispose());
        return;
      }

      textures.forEach((texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
      });

      const imageSizes = textures.map((t) => {
        const img = t.image as HTMLImageElement;
        return new THREE.Vector2(img.naturalWidth, img.naturalHeight);
      });

      const rippleConfig = {
        waveFreq: 25.0,
        wavePow: 0.035,
        waveWidth: 0.5,
        falloff: 10.0,
        boostStrength: 0.5,
        crossfadeWidth: 0.05,
        duration: 3.0,
        endValue: 1.0,
        ease: "power2.out",
      };

      const uniforms = {
        uTexCurrent: { value: textures[0] },
        uTexNext: { value: textures[1] },
        uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2() },
        uImageResCurrent: { value: imageSizes[0] },
        uImageResNext: { value: imageSizes[1] },
        uWaveFreq: { value: rippleConfig.waveFreq },
        uWavePow: { value: rippleConfig.wavePow },
        uWaveWidth: { value: rippleConfig.waveWidth },
        uFalloff: { value: rippleConfig.falloff },
        uBoostStrength: { value: rippleConfig.boostStrength },
        uCrossFadeWidth: { value: rippleConfig.crossfadeWidth },
        uMobile: { value: window.innerWidth <= 1000 ? 1.0 : 0.0 },
      };

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const getMaxCornerDist = () => {
        const aspect = window.innerWidth / window.innerHeight;
        return Math.sqrt(0.5 * 0.5 + 0.5 * aspect * (0.5 * aspect));
      };

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        uniforms.uMobile.value = window.innerWidth <= 1000 ? 1.0 : 0.0;
        rippleConfig.endValue = getMaxCornerDist() + rippleConfig.waveWidth;
        rippleConfig.duration = window.innerWidth <= 1000 ? 1.5 : 3.0;
      };
      window.addEventListener("resize", resize);
      resize();

      const firstSlide = buildSlideContent(SLIDES[0]);
      gsap.set(firstSlide, { opacity: 1 });
      const initialTitle = splitTitle(firstSlide);
      const initialLines = splitDescription(firstSlide);

      gsap.fromTo(
        initialTitle ? initialTitle.chars : [],
        { y: "100%" },
        { y: "0%", duration: 0.8, stagger: 0.025, ease: "power2.out" },
      );
      gsap.fromTo(
        initialLines,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.8,
          stagger: 0.025,
          ease: "power2.out",
          delay: 0.2,
        },
      );

      const transition = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (rippleTween) {
          rippleTween.kill();
          uniforms.uProgress.value = 0.0;
          rippleTween = null;
        }

        const nextIndex = (currentIndex + 1) % SLIDES.length;
        const currentSlide =
          slider.querySelector<HTMLElement>(".slide-content");
        if (!currentSlide) {
          isTransitioning = false;
          return;
        }

        const exitTimeline = animateTextOut(currentSlide);

        uniforms.uTexCurrent.value = textures[currentIndex];
        uniforms.uTexNext.value = textures[nextIndex];
        uniforms.uImageResCurrent.value = imageSizes[currentIndex];
        uniforms.uImageResNext.value = imageSizes[nextIndex];
        uniforms.uProgress.value = 0.0;

        let clickUnlocked = false;
        rippleTween = gsap.to(uniforms.uProgress, {
          value: rippleConfig.endValue,
          duration: rippleConfig.duration,
          ease: rippleConfig.ease,
          delay: 0.3,
          onUpdate() {
            if (!clickUnlocked && uniforms.uProgress.value > 0.7) {
              clickUnlocked = true;
              currentIndex = nextIndex;
              isTransitioning = false;
            }
          },
        });

        exitTimeline.then(() => {
          currentSlide.remove();
          const nextSlide = buildSlideContent(SLIDES[nextIndex]);
          requestAnimationFrame(() => animateTextIn(nextSlide));
        });
      };
      slider.addEventListener("click", transition);

      const render = () => {
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(render);
      };
      render();

      detach = () => {
        window.removeEventListener("resize", resize);
        slider.removeEventListener("click", transition);
        geometry.dispose();
        material.dispose();
        textures.forEach((t) => t.dispose());
      };
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      detach();
      rippleTween?.kill();
      renderer.domElement.remove();
      renderer.dispose();
      slider.querySelectorAll(".slide-content").forEach((el) => el.remove());
    };
  }, []);

  return (
    <main
      ref={sliderRef}
      className="shockwave fixed inset-0 h-svh w-full cursor-pointer overflow-hidden bg-[#e0ddcf] font-['PP_Neue_Montreal']"
    />
  );
};

export default ShockwaveSlider;
