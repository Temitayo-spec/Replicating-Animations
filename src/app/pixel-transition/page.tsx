'use client';
import PixelBackground from '@/components/pixelBackground';
import styles from './page.module.css';
import { useState } from 'react';

const PixelTransition = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <header className={styles.header}>
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
      <PixelBackground isOpen={isOpen} />
    </main>
  );
};

export default PixelTransition;
