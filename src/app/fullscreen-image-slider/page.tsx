'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './page.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slideImages: string[] = [
  'birmingham-museums-trust.jpg',
  'adrianna-geo.jpg',
  'the-path-by-lake.jpg',
  'paradise-street-towards-christ-church.jpg',
  'battle-of-the-pyramids.jpg',
];

const FullScreenImageSlider: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentTopValue, setCurrentTopValue] = useState<number>(0);

  const prefixRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    const slides = sliderRef.current?.querySelectorAll('#slide') as any;
    if (slides) {
      gsap.set(imageRef.current, { scale: 2, top: '4em' });
    }

    const showSlide = (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const currentTop: number = currentTopValue - 30;
      setCurrentTopValue(currentTop);

      tl.to([prefixRef.current, namesRef.current, yearsRef.current], {
        y: `${currentTop}px`,
        duration: 2,
        ease: 'power4.inOut',
        delay: 0.15,
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      const slide = slideRef.current as any;

      tl.to(imageRef.current, {
        scale: 1,
        top: '0%',
        duration: 2,
        ease: 'power3.inOut',
      });

      tl.to(
        slide,
        {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
          duration: 2,
          ease: 'power4.inOut',
          onComplete: () => {
            setIsAnimating(false);
          },
        },
        '<'
      );
    };

    const hideSlide = (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const currentTop: number = currentTopValue + 30;
      setCurrentTopValue(currentTop);

      gsap.to([prefixRef.current, namesRef.current, yearsRef.current], {
        y: `${currentTop}px`,
        duration: 2,
        ease: 'power4.inOut',
      });

      const slide = slideRef.current as any;

      tl.to(slide, {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        duration: 2,
        ease: 'power4.inOut',
      });

      tl.to(imageRef.current, {
        scale: 2,
        top: '4em',
        duration: 2,
        ease: 'power3.inOut',
      });

      tl.to(
        slide,
        {
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          duration: 2,
          ease: 'power4.inOut',
          onComplete: () => {
            setIsAnimating(false);
          },
        },
        '<'
      );
    };

    const handleScroll = (e: any) => {
      if (isAnimating) return;

      if (e.deltaY > 0 && currentSlideIndex < slideImages.length - 1) {
        showSlide(currentSlideIndex + 1);
        setCurrentSlideIndex(currentSlideIndex + 1);
      } else if (e.deltaY < 0 && currentSlideIndex > 0) {
        hideSlide(currentSlideIndex - 1);
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentSlideIndex, currentTopValue, isAnimating]);

  const prefixArray = Array.from({ length: slideImages.length });

  return (
    <>
      <div className={styles.slider__content}>
        <div className={styles.slide__number}>
          <div className={styles.prefix} ref={prefixRef}>
            {prefixArray.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <div className={styles.postfix}>
            <span>/</span> {slideImages.length}
          </div>
        </div>
        <div className={styles.slide__name}>
          <div className={styles.names} ref={namesRef}>
            {[
              'Near Glarus',
              'Palace of Versailles',
              'The Path By The Lake',
              'Paradise Street',
              'Battle of the Pyramids',
            ].map((name, index) => (
              <div key={index}>{name}</div>
            ))}
          </div>
        </div>
        <div className={styles.slide__year}>
          <div className={styles.years} ref={yearsRef}>
            {['1781', '1829', '1836', '1840', '1845'].map((year, index) => (
              <div key={index}>{year}</div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.slider} ref={sliderRef}>
        {slideImages.map((imageName, index) => (
          <div
            className={styles.slide}
            key={index}
            ref={currentSlideIndex === index ? slideRef : null}
            id={`slide__${index + 1}`}
          >
            <Image
              ref={currentSlideIndex === index ? imageRef : null}
              src={`/images/${imageName}`}
              alt={`slide__${index + 1}`}
              width={1920}
              height={1080}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FullScreenImageSlider;
