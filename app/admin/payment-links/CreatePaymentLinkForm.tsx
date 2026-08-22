'use client';

import React, { useState } from 'react';
import { createPaymentLink } from './actions';

export default function CreatePaymentLinkForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await createPaymentLink(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
      
      <div>
        <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Amount (INR) *</label>
        <input 
          type="number" 
          id="amount" 
          name="amount" 
          required 
          min="1"
          style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} 
        />
      </div>

      <div>
        <label htmlFor="purpose" style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Purpose (Optional)</label>
        <input 
          type="text" 
          id="purpose" 
          name="purpose" 
          placeholder="e.g., Custom Diet Plan"
          style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} 
        />
      </div>

      <div>
        <label htmlFor="durationHours" style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Valid For *</label>
        <select 
          id="durationHours" 
          name="durationHours" 
          required
          style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
        >
          <option value="1">1 Hour</option>
          <option value="24">24 Hours</option>
          <option value="72">3 Days</option>
          <option value="168">7 Days</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          padding: '1rem', 
          background: '#1eb53a', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginTop: '0.5rem'
        }}
      >
        {loading ? 'Creating...' : 'Create Link'}
      </button>
    </form>
  );
}
