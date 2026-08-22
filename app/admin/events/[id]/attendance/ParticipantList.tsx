'use client';

import React, { useState } from 'react';
import { togglePresence } from './actions';

export interface RegistrationData {
  id: string;
  name: string;
  additionalNames?: string[];
  ticketCode?: string | null;
  isPresent: boolean;
}

export default function ParticipantList({ registrations, eventId }: { registrations: RegistrationData[], eventId: string }) {
  const [search, setSearch] = useState('');

  const filtered = registrations.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.ticketCode && r.ticketCode.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await togglePresence(id, eventId, current);
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search by name or ticket code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '1rem' }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {filtered.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>No participants found.</p>
        ) : filtered.map(r => (
          <div key={r.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            background: '#222', 
            borderRadius: '6px',
            borderLeft: r.isPresent ? '4px solid #1eb53a' : '4px solid #555'
          }}>
            <div>
              <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold' }}>{r.name}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Ticket: {r.ticketCode || 'N/A'}</p>
            </div>
            
            <button 
              onClick={() => handleToggle(r.id, r.isPresent)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                background: r.isPresent ? '#1eb53a33' : '#444',
                color: r.isPresent ? '#28d648' : '#aaa'
              }}
            >
              {r.isPresent ? 'Present' : 'Absent'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
