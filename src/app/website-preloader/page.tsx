'use client';
import gsap from 'gsap';
import styles from './page.module.css';
import { useRef, useEffect } from 'react';

const WebsitePreloader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.website__content}>
        <header className={styles.header}>
          <div className={styles.h1}>
            <h1>Website</h1>
            <h1>Content</h1>
          </div>
          <div className={styles.header__revealer}></div>
        </header>
      </div>
      <div className={styles.loading__screen}>
        <div className={styles.loader}>
          <div className={`${styles.loader__1} ${styles.bar}`}></div>
          <div className={`${styles.loader__2} ${styles.bar}`}></div>
        </div>

        <div className={styles.counter}>
          <div className={`${styles.counter__1} ${styles.digit}`}>
            <div className={styles.num}>0</div>
            <div className={`${styles.num} ${styles.num1offset1}`}>1</div>
          </div>

          <div className={`${styles.counter__2} ${styles.digit}`}>
            <div className={styles.num}>0</div>
            <div className={`${styles.num} ${styles.num1offset2}`}>1</div>
            <div className={styles.num}>2</div>
            <div className={styles.num}>3</div>
            <div className={styles.num}>4</div>
            <div className={styles.num}>5</div>
            <div className={styles.num}>6</div>
            <div className={styles.num}>7</div>
            <div className={styles.num}>8</div>
            <div className={styles.num}>9</div>
            <div className={styles.num}>0</div>
          </div>

          <div className={`${styles.counter__3} ${styles.digit}`}>
            <div className={styles.num}>0</div>
            <div className={styles.num}>1</div>
            <div className={styles.num}>2</div>
            <div className={styles.num}>3</div>
            <div className={styles.num}>4</div>
            <div className={styles.num}>5</div>
            <div className={styles.num}>6</div>
            <div className={styles.num}>7</div>
            <div className={styles.num}>8</div>
            <div className={styles.num}>9</div>
            <div className={styles.num}>0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreloader;
