import React from 'react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
      <div className="page-spinner"></div>
      <p style={{ color: '#888', fontWeight: '500' }}>Loading...</p>
    </div>
  );
}
