"use client";
import Image from 'next/image';
import styles from './page.module.css';
import slide__1 from '../../../public/images/birmingham-museums-trust.jpg';
import slide__2 from '../../../public/images/adrianna-geo.jpg';
import slide__3 from '../../../public/images/the-path-by-lake.jpg';
import slide__4 from '../../../public/images/paradise-street-towards-christ-church.jpg';
import slide__5 from '../../../public/images/congreve-street.jpg';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
const slideImages: string[] = [
  'birmingham-museums-trust.jpg',
  'adrianna-geo.jpg',
  'the-path-by-lake.jpg',
  'paradise-street-towards-christ-church.jpg',
  'congreve-street.jpg',
];

type Element = {
  selector: string;
  delay: number;
};

const FullScreenImageSlider = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentTopValue, setCurrentTopValue] = useState<number>(0);

  const elements: Element[] = [
    { selector: '.prefix', delay: 0 },
    { selector: '.names', delay: 0.15 },
    { selector: '.years', delay: 0.3 },
  ];

  const showSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentTop: number = currentTopValue - 30;
    setCurrentTopValue(currentTop);

    gsap.to('.prefix, .names, .years', {
      y: `${currentTop}px`,
      duration: 2,
      ease: 'power4.inOut',
    });

    gsap.to('.slide', {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 2,
      ease: 'power4.inOut',
    });

    const img: HTMLElement | null = document.querySelector(
      `#slide__${index + 1} img`
    );
    gsap.to(img, {
      scale: 1,
      top: '0em',
      duration: 2,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsAnimating(false);
        setCurrentSlideIndex(index);
      },
    });
  };

  const hideSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentTop: number = currentTopValue + 30;
    setCurrentTopValue(currentTop);

    gsap.to('.prefix, .names, .years', {
      y: `${currentTop}px`,
      duration: 2,
      ease: 'power4.inOut',
    });

    gsap.to('.slide', {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      duration: 2,
      ease: 'power4.inOut',
    });

    const img: HTMLElement | null = document.querySelector(
      `#slide__${index + 1} img`
    );
    gsap.to(img, {
      scale: 2,
      top: '4em',
      duration: 2,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsAnimating(false);
        setCurrentSlideIndex(index);
      },
    });
  };

  const handleScroll = (e: { deltaY: number }) => {
    if (isAnimating) return;

    if (e.deltaY > 0 && currentSlideIndex < slideImages.length - 1) {
      showSlide(currentSlideIndex + 1);
    } else if (e.deltaY < 0 && currentSlideIndex > 0) {
      hideSlide(currentSlideIndex - 1);
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentSlideIndex]);

  return (
    <div className={styles.slider__content}>
      <div className={styles.slide__number}>
        <div className={styles.prefix}>
          {(Array.from({ length: slideImages.length }) as any).map(
            (_: any, index: number) => (
              <div key={index}>{index + 1}</div>
            )
          )}
        </div>
        <div className={styles.postfix}>
          <span>/</span> 5
        </div>
      </div>
      <div className={styles.slide__name}>
        <div className={styles.names}>
          <div>Near Glarus</div>
          <div>Palace of Versailles</div>
          <div>The Path By The Lake</div>
          <div>Paradise Street</div>
          <div>Congreve Street</div>
        </div>
      </div>
      <div className={styles.slide__year}>
        <div className={styles.years}>
          <div>1781</div>
          <div>1829</div>
          <div>1836</div>
          <div>1840</div>
          <div>1845</div>
        </div>
      </div>
      <div className={styles.slider}>
        <div className={styles.slide} id="slide__1">
          <Image src={slide__1} alt="slide__1" />
        </div>
        <div className={styles.slide} id="slide__2">
          <Image src={slide__2} alt="slide__2" />
        </div>
        <div className={styles.slide} id="slide__3">
          <Image src={slide__3} alt="slide__3" />
        </div>
        <div className={styles.slide} id="slide__4">
          <Image src={slide__4} alt="slide__4" />
        </div>
        <div className={styles.slide} id="slide__5">
          <Image src={slide__5} alt="slide__5" />
        </div>
        <div
          style={{
            height: '400vh',
          }}
        ></div>
      </div>
    </div>
  );
};

export default FullScreenImageSlider;
