'use client';

import React from 'react';
import { toggleCycleActive, deleteCycle } from './actions';

export default function CycleList({ cycles }: { cycles: any[] }) {
  if (cycles.length === 0) {
    return <p style={{ color: '#888' }}>No cycles in inventory yet.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {cycles.map(c => (
        <div key={c.id} style={{ background: '#222', padding: '1rem', borderRadius: '8px', borderLeft: c.isActive ? '4px solid #1eb53a' : '4px solid #555' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.3rem 0' }}>{c.type}</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Stock: {c.quantity}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => toggleCycleActive(c.id, c.isActive)}
                style={{ background: c.isActive ? '#333' : '#1eb53a', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                {c.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this cycle type?')) {
                    deleteCycle(c.id);
                  }
                }}
                style={{ background: '#ff4d4d22', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {c.pricing.map((p: any, i: number) => (
              <div key={i} style={{ background: '#111', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc', border: '1px solid #333' }}>
                {p.durationLabel}: ₹{p.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
