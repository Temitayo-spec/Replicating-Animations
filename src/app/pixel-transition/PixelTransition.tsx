'use client';
import PixelBackgroundCentered from '@/components/pixelTransition/centered';
import { useState } from 'react';
import PixelBackgroundHorizontal from '@/components/pixelTransition/horizontal';
import PixelBackgroundVertical from '@/components/pixelTransition/vertical';

const PixelTransition = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('centered');
  return (
    <main className="min-h-screen w-screen bg-[#1e1e1e] font-['Raleway']">
      <nav>
        <header className="w-[90%] mx-auto flex items-center justify-between h-20 p-4 absolute left-1/2 -translate-x-1/2 translate-y-[30%] z-[2]">
          <select
            className="w-auto p-2 text-[1.12rem] cursor-pointer"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="centered">Centered Animation</option>
            <option value="horizontal">Horizontal Animation</option>
            <option value="vertical">Vertical Animation</option>
          </select>
          <div
            className="flex flex-col gap-[10px] relative cursor-pointer z-[2] ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`w-[35px] h-[2px] rounded-[0.135rem] transition-all duration-500 ease-in-out ${
                isOpen
                  ? 'bg-[#1e1e1e] rotate-45 translate-x-[15px] translate-y-[2px]'
                  : 'bg-[#fcfcfc]'
              }`}
            ></div>
            <div
              className={`w-[35px] h-[2px] bg-[#fcfcfc] rounded-[0.135rem] transition-all duration-500 ease-in-out ${
                isOpen ? 'invisible opacity-0' : ''
              }`}
            ></div>
            <div
              className={`w-[35px] h-[2px] rounded-[0.135rem] transition-all duration-500 ease-in-out ${
                isOpen
                  ? 'bg-[#1e1e1e] -rotate-45 translate-x-[15px] -translate-y-[2px]'
                  : 'bg-[#fcfcfc]'
              }`}
            ></div>
          </div>
        </header>
        {isOpen && (
          <ul className="fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-center list-none gap-[5em]">
            <li className="text-[4rem] font-semibold">Home</li>
            <li className="text-[4rem] font-semibold">About</li>
            <li className="text-[4rem] font-semibold">Contact Us</li>
          </ul>
        )}
      </nav>
      {selected === 'centered' && <PixelBackgroundCentered isOpen={isOpen} />}
      {selected === 'horizontal' && (
        <PixelBackgroundHorizontal isOpen={isOpen} />
      )}
      {selected === 'vertical' && <PixelBackgroundVertical isOpen={isOpen} />}
    </main>
  );
};

export default PixelTransition;
