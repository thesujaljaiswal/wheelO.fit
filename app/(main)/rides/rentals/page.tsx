import React from 'react';
import styles from '../rides.module.css';
import RentalBookingForm from '@/app/(main)/rentals/RentalBookingForm';
import RentalsView from './RentalsView';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RentalsPage() {
  const cycles = await (prisma as any).rentalCycle.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { bookings: { where: { status: 'CONFIRMED' } } }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const cyclesWithStockInfo = cycles.map((cycle: any) => {
    let isInstock = cycle.quantity > 0;
    let nextAvailableDate: string | null = null;
    
    if (isInstock && cycle.bookings && cycle.bookings.length > 0) {
      // Helper to get booked quantity for a specific date
      const getBookedQty = (date: Date) => cycle.bookings.reduce((sum: number, b: any) => {
         const bStart = new Date(b.startDate); bStart.setHours(0,0,0,0);
         const bEnd = new Date(b.endDate); bEnd.setHours(23,59,59,999);
         if (date >= bStart && date <= bEnd) {
           return sum + b.quantity;
         }
         return sum;
      }, 0);

      // Check if available today
      if (cycle.quantity - getBookedQty(today) <= 0) {
         isInstock = false;
         
         // Find next available date in the next 365 days
         for (let i = 1; i <= 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            if (cycle.quantity - getBookedQty(d) > 0) {
               nextAvailableDate = d.toISOString();
               break;
            }
         }
      }
    } else if (cycle.quantity <= 0) {
       isInstock = false;
    }

    return {
      ...cycle,
      isInstock,
      nextAvailableDate
    };
  });

  return (
    <main>
      <div className={styles.hero}>
        <img src="/rentals-hero.png" alt="Bicycle Rentals" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <h1 className={styles.title}>Bicycle Rentals</h1>
      </div>
      
      <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <RentalsView cycles={cyclesWithStockInfo} />
      </div>
    </main>
  );
}
