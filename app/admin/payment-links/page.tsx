import React from 'react';
import prisma from '@/lib/prisma';
import CopyLinkSection from './CopyLinkSection';
import PaymentLinkListItem from './PaymentLinkListItem';

export default async function ManagePaymentLinksPage() {
  const links = await prisma.paymentLink.findMany({
    where: {
      paymentStatus: { in: ['SUCCESS', 'REFUNDED'] }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Custom Payments</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        View all custom payments made via the payment page.
      </p>

      <CopyLinkSection />
      
      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Recent Payments</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {links.length === 0 ? (
            <p style={{ color: '#888' }}>No payments found.</p>
          ) : links.map((link) => (
            <PaymentLinkListItem key={link.id} link={link} />
          ))}
        </ul>
      </div>
    </div>
  );
}
