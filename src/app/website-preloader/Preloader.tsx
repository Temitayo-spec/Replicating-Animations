"use client";
import gsap from "gsap";
import { useRef, useEffect } from "react";

const WebsitePreloader = () => {
  return (
    <div className="w-screen min-h-screen font-['Raleway']">
      <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
        <header className="relative w-max h-max">
          <div className="flex">
            <h1 className="text-[80px] text-center relative top-[80px] mx-[10px] uppercase font-normal">
              Website
            </h1>
            <h1 className="text-[80px] text-center relative top-[80px] mx-[10px] uppercase font-normal">
              Content
            </h1>
          </div>
          <div className="absolute top-[80px] w-full h-full after:content-[''] after:absolute after:top-[80px] after:left-0 after:w-[105%] after:h-[110%] after:bg-[#fafafa]"></div>
        </header>
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-[#1e1e1e] text-[#fafafa] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[50px] -translate-x-1/2 -translate-y-1/2 flex bg-[rgb(80,80,80)]">
          <div className="loader__1 relative bg-[#fafafa] w-[200px] h-[50px]"></div>
          <div className="loader__2 relative w-[100px] bg-[#fafafa] h-[50px]"></div>
        </div>

        <div className="counter fixed left-[50px] bottom-[50px] flex h-[100px] text-[100px] leading-[102px] [clip-path:polygon(0_0,100%_0,100%_100px,0_100px)] font-normal">
          <div className="counter__1 relative top-[-15px]">
            <div>0</div>
            <div className="relative right-[-25px]">1</div>
          </div>

          <div className="counter__2 relative top-[-15px]">
            <div>0</div>
            <div className="relative right-[-10px]">1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>0</div>
          </div>

          <div className="counter__3 relative top-[-15px]">
            <div>0</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreloader;
