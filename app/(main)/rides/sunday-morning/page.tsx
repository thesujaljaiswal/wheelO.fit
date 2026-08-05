import React from 'react';
import Link from 'next/link';
import { BookingForm } from '@/components/ui/BookingForm';
import prisma from '@/lib/prisma';
import { RidePageLayout } from '@/components/ui/RidePageLayout';
import styles from '@/components/ui/RidePageLayout.module.css';

const sliderImages = [
  { id: "1", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", height: 400 },
  { id: "2", img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=600&auto=format&fit=crop", height: 250 },
  { id: "3", img: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=600&auto=format&fit=crop", height: 600 },
  { id: "4", img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=600&auto=format&fit=crop", height: 350 },
  { id: "5", img: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop", height: 450 },
];

export default async function SundayMorningPage() {
  const events = await prisma.event.findMany({
    where: { eventType: 'SUNDAY', isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' }
  });

  const overview = (
    <div>
      <p>Embrace the quiet of the early morning with our Sunday sunrise rides. Experience the city waking up as we pedal through scenic routes and coastal roads.</p>
      <p>These rides are perfect for all skill levels, ending with a group breakfast at local cafes to start your Sunday the right way.</p>
    </div>
  );

  const inclusionsExclusions = (
    <div className={styles.grid2Col}>
      <div className={styles.incCard}>
        <h3>Inclusions</h3>
        <ul className={`${styles.list} ${styles.incList}`}>
          <li>Geared Bicycle</li>
          <li>Helmet</li>
          <li>Refreshing Morning Drink / Breakfast</li>
          <li>First Aid & Mechanical Support</li>
        </ul>
      </div>
      <div className={styles.excCard}>
        <h3>Exclusions</h3>
        <ul className={`${styles.list} ${styles.excList}`}>
          <li>Travel to start point</li>
          <li>Additional food/drinks at cafe</li>
          <li>Personal expenses</li>
        </ul>
      </div>
    </div>
  );

  const itinerary = (
    <div className={styles.timeline}>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>06:00 AM</span>
        Assemble at the starting point, brief introduction.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>06:15 AM</span>
        Start the ride and catch the beautiful sunrise.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>07:30 AM</span>
        Breakfast break at a famous local spot.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>08:30 AM</span>
        Ride concludes.
      </div>
    </div>
  );

  const additionalSections = [
    {
      title: 'Things to carry',
      content: (
        <ul className={styles.list}>
          <li><span style={{color: '#1eb53a'}}>✦</span> Water bottle</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Comfortable activewear</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Sunglasses and sunscreen</li>
        </ul>
      )
    },
    {
      title: 'Disclaimer & Policies',
      content: (
        <div>
          <p><strong>Disclaimer:</strong> Safety first. Riders must follow all traffic rules.</p>
          <p style={{marginTop: '10px'}}><strong>Cancellation Policy:</strong> 100% refund if cancelled 48 hours prior to the event. No refund within 48 hours.</p>
        </div>
      )
    },
    {
      title: 'FAQs',
      content: (
        <div>
          <p><strong>Q: Is breakfast included?</strong><br/>A: A basic breakfast or morning refreshment is included. You can purchase additional items directly.</p>
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/faq" style={{ color: 'var(--primary, #1eb53a)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              View all FAQs <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )
    }
  ];

  return (
    <RidePageLayout 
      title="Sunday Morning Rides"
      overview={overview}
      inclusionsExclusions={inclusionsExclusions}
      itinerary={itinerary}
      additionalSections={additionalSections}
      sliderImages={sliderImages}
      priceText="₹649"
      bookingForm={<BookingForm title="Book Your Spot" buttonText="Register Now" events={events} />}
    />
  );
}
