import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function AttendanceDashboardPage() {
  const events = await prisma.event.findMany({
    include: {
      registrations: {
        where: { paymentStatus: 'SUCCESS' }
      }
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Event Attendance</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Select an event to open the scanner and manage attendance.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.length === 0 ? (
          <p style={{ color: '#888' }}>No events yet.</p>
        ) : events.map((event: any) => {
          const presentCount = event.registrations.filter((r: any) => r.isPresent).length;
          
          return (
            <Link key={event.id} href={`/admin/attendance/${event.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', transition: 'background 0.2s ease', cursor: 'pointer' }}>
                <div style={{ flex: '1 1 min-content', minWidth: '250px' }}>
                  <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.3rem', wordBreak: 'break-word' }}>
                    {event.title}
                  </h2>
                  <div style={{ fontSize: '0.9rem', color: '#ccc', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
                    <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    <span><strong>Time:</strong> {event.timeSlot}</span>
                    <span><strong>Type:</strong> {event.eventType}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#1eb53a22', border: '1px solid #1eb53a', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#1eb53a' }}>
                    {presentCount} / {event.registrations.length} Present
                  </div>
                  <ArrowRight size={20} color="#888" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
