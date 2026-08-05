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

export default async function MidnightRidesPage() {
  const events = await prisma.event.findMany({
    where: { eventType: 'MIDNIGHT', isActive: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' }
  });

  const overview = (
    <div>
      <p>There's nothing quite like the freedom of the city streets at midnight. Join our vibrant community for weekly nocturnal adventures under the city lights.</p>
      <p>Our midnight rides are fully escorted with safety vehicles and experienced group leaders, ensuring a safe, exhilarating experience for everyone.</p>
    </div>
  );

  const inclusionsExclusions = (
    <div className={styles.grid2Col}>
      <div className={styles.incCard}>
        <h3>Inclusions</h3>
        <ul className={`${styles.list} ${styles.incList}`}>
          <li>Geared Bicycle</li>
          <li>Helmet</li>
          <li>Reflective Vest</li>
          <li>Midnight Snacks & Chai</li>
          <li>First Aid & Mechanical Support</li>
        </ul>
      </div>
      <div className={styles.excCard}>
        <h3>Exclusions</h3>
        <ul className={`${styles.list} ${styles.excList}`}>
          <li>Travel to start point</li>
          <li>Personal expenses</li>
          <li>Any items not mentioned in inclusions</li>
        </ul>
      </div>
    </div>
  );

  const itinerary = (
    <div className={styles.timeline}>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>11:30 PM</span>
        Assemble at the starting point, brief introduction and safety instructions.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>12:00 AM</span>
        Ride begins! Pedal through the empty, beautiful streets.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>01:30 AM</span>
        Mid-point break for Chai and snacks.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>03:00 AM</span>
        Reach the destination, click group pictures.
      </div>
      <div className={styles.timelineItem}>
        <span className={styles.timelineTime}>03:30 AM</span>
        Ride concludes.
      </div>
    </div>
  );

  const additionalSections = [
    {
      title: 'Things to carry',
      content: (
        <ul className={styles.list}>
          <li><span style={{color: '#1eb53a'}}>✦</span> Water bottle (At least 1 liter)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Comfortable riding gear (shorts/track pants, t-shirt)</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> A small backpack</li>
          <li><span style={{color: '#1eb53a'}}>✦</span> Personal medicines (if any)</li>
        </ul>
      )
    },
    {
      title: 'Disclaimer & Policies',
      content: (
        <div>
          <p><strong>Disclaimer:</strong> Cycling involves physical exertion and inherent risks. Participants must ensure they are medically fit.</p>
          <p style={{marginTop: '10px'}}><strong>Cancellation Policy:</strong> 100% refund if cancelled 48 hours prior to the event. No refund within 48 hours.</p>
        </div>
      )
    },
    {
      title: 'FAQs',
      content: (
        <div>
          <p><strong>Q: Do I need to bring my own cycle?</strong><br/>A: No, geared cycles are included in the package unless you choose the BYOC (Bring Your Own Cycle) ticket.</p>
          <p style={{marginTop: '10px'}}><strong>Q: Is it safe for solo female riders?</strong><br/>A: Absolutely! We have female ride leaders and a support vehicle accompanying the group at all times.</p>
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
      title="Midnight Rides"
      overview={overview}
      inclusionsExclusions={inclusionsExclusions}
      itinerary={itinerary}
      additionalSections={additionalSections}
      sliderImages={sliderImages}
      priceText="₹749"
      bookingForm={
        <BookingForm 
          title="Book Your Spot"
          buttonText="Register Now"
          events={events}
        />
      }
    />
  );
}
