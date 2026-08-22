import React from 'react';
import prisma from '@/lib/prisma';
import CreateEventForm from './CreateEventForm';
import EventListItem from './EventListItem';
import styles from '../admin.module.css';

export default async function ManageEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Manage Events</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Create and manage events. Once an event is created, it will be visible on the public website for users to register.
      </p>
      
      <div className={styles.twoColumnGrid}>
        <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Create New Event</h2>
          <CreateEventForm />
        </div>
        
        <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>All Events</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.length === 0 ? (
              <p style={{ color: '#888' }}>No events created yet.</p>
            ) : events.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
