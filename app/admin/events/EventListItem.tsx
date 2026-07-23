'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { toggleEventActive, editEvent } from './actions';

type Event = {
  id: string;
  title: string;
  eventType: string;
  date: Date;
  timeSlot: string;
  ageLimit: string | null;
  isActive: boolean;
};

export default function EventListItem({ event }: { event: Event }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleToggleActive() {
    startTransition(async () => {
      const res = await toggleEventActive(event.id, event.isActive);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  async function handleEditSubmit(formData: FormData) {
    setError(null);
    // isActive checkbox fix for unchecked state
    if (!formData.has('isActive')) {
      formData.append('isActive', 'false');
    }
    
    startTransition(async () => {
      const res = await editEvent(event.id, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  if (isEditing) {
    // Format date for input type="date"
    const dateObj = new Date(event.date);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateFormatted = `${yyyy}-${mm}-${dd}`;

    return (
      <li style={{ padding: '1rem', background: '#222', borderRadius: '6px', border: '1px solid #444', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form action={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ color: '#ff4d4d', fontSize: '0.8rem' }}>{error}</div>}
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Title</label>
              <input 
                name="title" 
                defaultValue={event.title} 
                required 
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }} 
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Event Type</label>
              <select 
                name="eventType" 
                defaultValue={event.eventType}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }}
              >
                <option value="MIDNIGHT">MIDNIGHT</option>
                <option value="SUNDAY">SUNDAY</option>
                <option value="CYCLE_CLASS">CYCLE_CLASS</option>
                <option value="RENTAL">RENTAL</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Date</label>
              <input 
                type="date" 
                name="date" 
                defaultValue={dateFormatted}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }} 
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Time Slot</label>
              <input 
                type="text" 
                name="timeSlot" 
                defaultValue={event.timeSlot}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }} 
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>Age Limit (Optional)</label>
              <input 
                type="text" 
                name="ageLimit" 
                defaultValue={event.ageLimit || ''}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }} 
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#fff', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  value="true"
                  defaultChecked={event.isActive}
                  style={{ width: '1.2rem', height: '1.2rem' }} 
                />
                Active
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setError(null); }}
              disabled={isPending}
              style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: '#ccc', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              style={{ padding: '0.4rem 0.8rem', background: '#1eb53a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li style={{ padding: '1rem', background: '#222', borderRadius: '6px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <strong style={{ fontSize: '1.1rem' }}>{event.title}</strong>
          <span style={{ 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px', 
            fontSize: '0.7rem', 
            background: event.isActive ? 'rgba(77,255,77,0.2)' : 'rgba(255,77,77,0.2)',
            color: event.isActive ? '#4dff4d' : '#ff4d4d'
          }}>
            {event.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
          <strong>Type:</strong> {event.eventType}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB')}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
          <strong>Time:</strong> {event.timeSlot}
        </div>
        {event.ageLimit && (
          <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
            <strong>Age Limit:</strong> {event.ageLimit}
          </div>
        )}
        {error && <div style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</div>}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Link 
          href={`/admin/attendance/${event.id}`}
          style={{ padding: '0.3rem 0.6rem', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
        >
          Attendance
        </Link>
        <button 
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          style={{ padding: '0.3rem 0.6rem', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Edit
        </button>
        <button 
          onClick={handleToggleActive}
          disabled={isPending}
          style={{ padding: '0.3rem 0.6rem', background: event.isActive ? '#ff9900' : '#1eb53a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          {isPending ? '...' : (event.isActive ? 'Disable' : 'Enable')}
        </button>
      </div>
    </li>
  );
}
