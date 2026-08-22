import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const [totalEvents, activeEvents, totalRegistrations, upcomingEvents, recentRegistrations] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { isActive: true } }),
    prisma.registration.count({ where: { paymentStatus: 'SUCCESS' } }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 4,
      include: {
        _count: {
          select: { registrations: { where: { paymentStatus: 'SUCCESS' } } }
        }
      }
    }),
    prisma.registration.findMany({
      where: { paymentStatus: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        event: {
          select: { title: true }
        }
      }
    })
  ]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Overview of your events and registrations.
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Events</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalEvents}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Events</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4dff4d' }}>{activeEvents}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Registrations</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4da6ff' }}>{totalRegistrations}</div>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        {/* Upcoming Events */}
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Upcoming Events</h2>
            <Link href="/admin/events" style={{ color: '#1eb53a', textDecoration: 'none', fontSize: '0.9rem' }}>View All</Link>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No upcoming events scheduled.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map((event: any) => (
                <li key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #222' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', wordBreak: 'break-word' }}>{event.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      {event.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} at {event.timeSlot}
                    </div>
                  </div>
                  <div style={{ background: '#222', padding: '0.3rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {event._count.registrations} <span style={{ color: '#888' }}>regs</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Registrations */}
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Recent Registrations</h2>
            <Link href="/admin/responses" style={{ color: '#1eb53a', textDecoration: 'none', fontSize: '0.9rem' }}>View All</Link>
          </div>

          {recentRegistrations.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No recent registrations.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentRegistrations.map((reg: any) => (
                <li key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #222' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', wordBreak: 'break-word' }}>{reg.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      Event: <span style={{ color: '#ccc' }}>{reg.event.title}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
