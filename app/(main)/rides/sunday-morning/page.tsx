import React from 'react';
import styles from '../rides.module.css';
import { BookingForm } from '@/components/ui/BookingForm';
import prisma from '@/lib/prisma';
import Masonry from '@/components/react-bits/Masonry';

const masonryItems = [
  { id: "1", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", url: "#", height: 400 },
  { id: "2", img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=600&auto=format&fit=crop", url: "#", height: 250 },
  { id: "3", img: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=600&auto=format&fit=crop", url: "#", height: 600 },
  { id: "4", img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=600&auto=format&fit=crop", url: "#", height: 350 },
  { id: "5", img: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop", url: "#", height: 450 }
];

export default async function SundayMorningPage() {
  const events = await prisma.event.findMany({
    where: { eventType: 'SUNDAY', isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' }
  });

  return (
    <main>
      <div className={styles.hero}>
        <img src="/sunday-morning-hero.png" alt="Sunday Morning Rides" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <h1 className={styles.title}>Sunday Morning Rides</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.description}>
          <h2>Start Your Day Right</h2>
          <p>
            Embrace the quiet of the early morning with our Sunday sunrise rides. Experience the city waking up as we pedal through scenic routes and coastal roads.
          </p>
          <p>
            These rides are perfect for all skill levels, ending with a group breakfast at local cafes.
          </p>
        </div>
        
        <div className={styles.formSection}>
          <BookingForm 
            title="Book Your Spot"
            buttonText="Register Now"
            events={events}
          />
        </div>
      </div>
      <div style={{ padding: '2rem 5%', marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>Event Gallery</h2>
        <div style={{ position: 'relative' }}>
          <Masonry items={masonryItems} />
        </div>
      </div>
    </main>
  );
}
