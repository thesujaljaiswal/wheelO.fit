'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './BookingForm.module.css';
import { registerForEvent } from '@/app/(main)/rides/actions';

type EventData = {
  id: string;
  title: string;
  date: Date;
  timeSlot: string;
};

type BookingFormProps = {
  title: string;
  events?: EventData[];
  buttonText?: string;
};

export function BookingForm({ title, events = [], buttonText = 'Book Now' }: BookingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedEvent = events.find(ev => ev.id === selectedEventId);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(null);
    
    // Manually add the selectedEventId since it's no longer a standard form input
    if (!selectedEventId) {
      setError('Please select an event to register.');
      setPending(false);
      return;
    }
    formData.append('eventId', selectedEventId);

    const res = await registerForEvent(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      if (res.ticketCode) {
        router.push(`/ticket/${res.ticketCode}`);
      } else {
        setSuccess(res.success);
      }
    }
    
    setPending(false);
  }

  if (success) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <h3 className={styles.title}>Thank You!</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>{success}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <h3 className={styles.title}>{title}</h3>
        <p style={{ color: '#aaa', padding: '2rem 0' }}>No upcoming events scheduled right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>{title}</h3>
      <form action={handleSubmit}>
        {error && <div style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
        
        <div className={styles.field} style={{ marginBottom: '8px' }}>
          <label className={styles.label}>Select Event / Date</label>
        </div>
        
        <div className={styles.eventDropdownContainer}>
          <div 
            className={`${styles.eventDropdownTrigger} ${selectedEvent ? styles.eventDropdownTriggerSelected : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedEvent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={styles.eventTitle}>{selectedEvent.title}</span>
                <span className={styles.eventDate}>{selectedEvent.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className={styles.eventTime}>{selectedEvent.timeSlot}</span>
              </div>
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Select an upcoming event...</span>
            )}
            <svg 
              className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''}`} 
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className={styles.eventCardList}>
              {events.map(ev => {
                const formattedDate = ev.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <label 
                    key={ev.id} 
                    className={`${styles.eventCard} ${selectedEventId === ev.id ? styles.eventCardSelected : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="eventId_dummy" 
                      value={ev.id}
                      onChange={(e) => {
                        setSelectedEventId(e.target.value);
                        setIsDropdownOpen(false);
                      }}
                      checked={selectedEventId === ev.id}
                    />
                    <span className={styles.eventTitle}>{ev.title}</span>
                    <span className={styles.eventDate}>{formattedDate}</span>
                    <span className={styles.eventTime}>{ev.timeSlot}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Full Name</label>
          <input className={styles.input} type="text" id="name" name="name" placeholder="John Doe" required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email Address</label>
          <input className={styles.input} type="email" id="email" name="email" placeholder="john@example.com" required />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Phone Number</label>
          <input className={styles.input} type="tel" id="phone" name="phone" placeholder="+1 234 567 8900" required />
        </div>

        <button type="submit" disabled={pending} className={styles.submitBtn}>
          {pending ? 'Submitting...' : buttonText}
        </button>
      </form>
    </div>
  );
}
