'use client';
import PixelBackgroundCentered from '@/components/pixelTransition/centered';
import styles from './page.module.css';
import { useState } from 'react';
import PixelBackgroundHorizontal from '@/components/pixelTransition/horizontal';
import PixelBackgroundVertical from '@/components/pixelTransition/vertical';

const PixelTransition = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('centered');
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <header className={styles.header}>
          <select
            className={styles.select}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="centered">Centered Animation</option>
            <option value="horizontal">Horizontal Animation</option>
            <option value="vertical">Vertical Animation</option>
          </select>
          <div
            className={`${styles.burger__menu} ${
              isOpen ? styles.burger__active : ''
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </header>
        {isOpen && (
          <ul className={styles.menu}>
            <li>Home</li>
            <li>About</li>
            <li>Contact Us</li>
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
