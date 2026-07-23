import React from 'react';
import prisma from '@/lib/prisma';
import RentalBookingForm from './RentalBookingForm';

export const dynamic = 'force-dynamic';

export default async function RentalsPage() {
  const cycles = await (prisma as any).rentalCycle.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Rent a Cycle</h1>
      <p style={{ textAlign: 'center', color: '#aaa', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Explore the city on two wheels. Choose your ride and book instantly.
      </p>
      
      <RentalBookingForm cycles={cycles} />
    </div>
  );
}
