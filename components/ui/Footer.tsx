import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

import prisma from '@/lib/prisma';
import { FAQAccordion } from './FAQAccordion';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandInfo}>
            <p className={styles.description}>
              Elevating your cycling experience. From high-octane indoor classes to breathtaking outdoor adventures.
            </p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h3>Experiences</h3>
              <Link href="/rides/cycle-classes">Cycle Classes</Link>
              <Link href="/rides/midnight-rides">Midnight Rides</Link>
              <Link href="/rides/sunday-morning">Sunday Rides</Link>
              <Link href="/rides/rentals">Rentals</Link>
            </div>
            <div className={styles.linkColumn}>
              <h3>Company</h3>
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className={styles.linkColumn}>
              <h3>Legal</h3>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/faq">FAQ's</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} WheelO.fit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
