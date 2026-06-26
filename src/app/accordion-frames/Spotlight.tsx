"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const PANEL_WIDTH_COLLAPSED = 20;
const PANEL_WIDTH_EXPANDED = 400;
const PANEL_WIDTH_EXPANDED_MOBILE = 100;
const PANEL_GAP = 5;
const PANEL_COUNT_DESKTOP = 20;
const PANEL_COUNT_MOBILE = 10;
const BREAKPOINT_MOBILE = 1000;

const PANEL_IMAGES = Array.from({ length: 12 }).flatMap((_, i) => [
  `/images/spotlight-${i}.jpg`,
  `/images/${i + 1}.jpg`,
]);

const Spotlight = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedPanel, setFocusedPanel] = useState<number>(0);

  const panelCount = isMobile ? PANEL_COUNT_MOBILE : PANEL_COUNT_DESKTOP;

  const expandedWidth = isMobile
    ? PANEL_WIDTH_EXPANDED_MOBILE
    : PANEL_WIDTH_EXPANDED;

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setTrackWidth(entry.contentRect.width);
      setIsMobile(window.innerWidth <= BREAKPOINT_MOBILE);
    });

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setFocusedPanel(0);
  }, [panelCount]);

  const getPanelPosition = useCallback(
    (panelIndex: number) => {
      const totalTrackWidth =
        (panelCount - 1) * (PANEL_WIDTH_COLLAPSED + PANEL_GAP) + expandedWidth;
      const offsetToCenter = (trackWidth - totalTrackWidth) / 2;

      let left = offsetToCenter;
      for (let i = 0; i < panelIndex; i++) {
        const w = i === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;
        left += w + PANEL_GAP;
      }

      const width =
        panelIndex === focusedPanel ? expandedWidth : PANEL_WIDTH_COLLAPSED;

      return { left, width };
    },
    [focusedPanel, panelCount, expandedWidth, trackWidth],
  );

  const focusPanel = useCallback((index: number) => {
    setFocusedPanel(index);
  }, []);

  const getFocusIndicatorPosition = useCallback(() => {
    return getPanelPosition(focusedPanel);
  }, [getPanelPosition, focusedPanel]);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-[#0a0a0a]">
      <div
        ref={trackRef}
        className="absolute left-1/2 top-1/2 w-[90%] max-w-[1400px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-[400px] w-full max-[1000px]:h-[260px]">
          <div
            className="pointer-events-none absolute top-0 z-100 h-full border-[3px] border-white transition-all duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] will-change-[left,width] before:absolute before:bottom-full before:left-1/2 before:h-svh before:w-[3px] before:-translate-x-1/2 before:bg-white before:content-[''] after:absolute after:top-full after:left-1/2 after:h-svh after:w-[3px] after:-translate-x-1/2 after:bg-white after:content-['']"
            style={getFocusIndicatorPosition()}
          />
          {Array.from({ length: panelCount }).map((_, i) => (
            <div
              key={`${isMobile ? "m" : "d"}-${i}`}
              className="absolute top-0 h-full cursor-pointer overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] will-change-[left,width]"
              style={getPanelPosition(i)}
              onMouseEnter={!isMobile ? () => focusPanel(i) : undefined}
              onClick={isMobile ? () => focusPanel(i) : undefined}
            >
              <Image
                src={PANEL_IMAGES[i % PANEL_IMAGES.length]}
                alt={`Frame ${i + 1}`}
                width={PANEL_WIDTH_EXPANDED}
                height={400}
                className="pointer-events-none absolute left-1/2 h-full w-[400px] -translate-x-1/2 select-none object-cover max-[1000px]:w-[200px]"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
