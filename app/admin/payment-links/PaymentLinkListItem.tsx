'use client';

import React, { useState } from 'react';
import { PaymentLink } from '@prisma/client';
import { deletePaymentLink } from './actions';

export default function PaymentLinkListItem({ link }: { link: PaymentLink }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = origin.replace('admin.', '');
  const shareableUrl = `${baseUrl}/pay/${link.id}`;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this payment link?')) {
      setDeleting(true);
      await deletePaymentLink(link.id);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(link.expiresAt) < new Date();

  return (
    <li style={{ 
      background: '#222', 
      padding: '1rem', 
      borderRadius: '6px', 
      border: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem' }}>₹{link.amount}</h3>
          {link.purpose && <p style={{ margin: '0 0 0.5rem 0', color: '#ccc', fontSize: '0.9rem' }}>{link.purpose}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <span style={{ 
              background: link.paymentStatus === 'SUCCESS' ? '#1eb53a' : '#444',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {link.paymentStatus}
            </span>
            {isExpired && link.paymentStatus !== 'SUCCESS' && (
              <span style={{ background: '#ff4d4d', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>EXPIRED</span>
            )}
          </div>
        </div>
        <button 
          onClick={handleDelete}
          disabled={deleting}
          style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer' }}
          title="Delete Link"
        >
          {deleting ? '...' : '✕'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#888' }}>
        <span>Expires: {new Date(link.expiresAt).toLocaleString()}</span>
        {link.name && <span>Paid by: {link.name} ({link.email})</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input 
          type="text" 
          readOnly 
          value={shareableUrl} 
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#111', color: '#aaa', fontSize: '0.8rem' }}
        />
        <button 
          onClick={handleCopy}
          style={{ 
            padding: '0.5rem 1rem', 
            background: copied ? '#1eb53a' : '#333', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </li>
  );
}
