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

export default async function RentalsPage() {
  const events = await prisma.event.findMany({
    where: { eventType: 'RENTAL', isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' }
  });

  return (
    <main>
      <div className={styles.hero}>
        <img src="/rentals-hero.png" alt="Bicycle Rentals" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <h1 className={styles.title}>Bicycle Rentals</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.description}>
          <h2>Ride Your Way</h2>
          <p>
            Don't have a bike? No problem. We offer a wide range of premium bicycles for rent. From city cruisers to high-performance road bikes, we have the perfect ride for your next adventure.
          </p>
          <p>
            All rentals include a helmet, lock, and basic maintenance kit. Daily and weekly rates available.
          </p>
        </div>
        
        <div className={styles.formSection}>
          <BookingForm 
            title="Rent a Bike"
            buttonText="Request Rental"
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
