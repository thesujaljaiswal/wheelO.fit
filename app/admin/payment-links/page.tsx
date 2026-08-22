import React from 'react';
import prisma from '@/lib/prisma';
import CreatePaymentLinkForm from './CreatePaymentLinkForm';
import PaymentLinkListItem from './PaymentLinkListItem';
import styles from '../admin.module.css';

export default async function ManagePaymentLinksPage() {
  const links = await prisma.paymentLink.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Payment Links</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Create and share payment links for custom amounts.
      </p>
      
      <div className={styles.twoColumnGrid}>
        <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Create New Link</h2>
          <CreatePaymentLinkForm />
        </div>
        
        <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Generated Links</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.length === 0 ? (
              <p style={{ color: '#888' }}>No payment links created yet.</p>
            ) : links.map((link) => (
              <PaymentLinkListItem key={link.id} link={link} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
