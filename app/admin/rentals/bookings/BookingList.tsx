'use client';

import React from 'react';
import { updateBookingStatus } from '../actions';
import RefundButton from '@/app/admin/components/RefundButton';

export interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  quantity: number;
  startDate: Date | string;
  endDate: Date | string;
  transactionId?: string;
  cycle?: { type: string };
}

export default function BookingList({ bookings }: { bookings: BookingData[] }) {
  const [pendingAction, setPendingAction] = React.useState<{ id: string, action: string } | null>(null);
  
  if (bookings.length === 0) {
    return <p style={{ color: '#888' }}>No bookings found.</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return '#1eb53a';
      case 'RETURNED': return '#888';
      case 'CANCELLED': return '#ff4d4d';
      default: return '#fff';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <style>
        {`
          @media (max-width: 600px) {
            .booking-card {
              flex-direction: column !important;
              gap: 1rem !important;
            }
            .booking-title {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.5rem !important;
            }
            .booking-actions {
              width: 100% !important;
              flex-direction: row !important;
              gap: 0.5rem !important;
            }
            .booking-actions button {
              flex: 1 !important;
              padding: 0.8rem !important;
            }
          }
        `}
      </style>
      {bookings.map(b => (
        <div key={b.id} style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', borderLeft: `4px solid ${getStatusColor(b.status)}` }}>
          <div className="booking-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 className="booking-title" style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {b.name}
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '10px', background: '#333', color: getStatusColor(b.status) }}>
                  {b.status}
                </span>
              </h3>
              <p style={{ margin: '0 0 0.3rem 0', color: '#ccc', fontSize: '0.9rem' }}>
                <strong>Cycle:</strong> {b.cycle?.type || 'Unknown'} (Qty: {b.quantity})
              </p>
              <p style={{ margin: '0 0 0.3rem 0', color: '#ccc', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                <strong>Dates:</strong> {new Date(b.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(b.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <p style={{ margin: '0 0 0.3rem 0', color: '#888', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                {b.email} | {b.phone}
              </p>
            </div>
            
            <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {b.status === 'CONFIRMED' && (
                <>
                  <button 
                    onClick={async () => {
                      setPendingAction({ id: b.id, action: 'RETURNED' });
                      await updateBookingStatus(b.id, 'RETURNED');
                      setPendingAction(null);
                    }}
                    disabled={pendingAction !== null}
                    style={{ background: '#333', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: pendingAction ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: pendingAction ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {pendingAction?.id === b.id && pendingAction?.action === 'RETURNED' ? <><span className="btn-spinner"></span> Updating...</> : 'Mark Returned'}
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Cancel this booking without refunding?')) {
                        setPendingAction({ id: b.id, action: 'CANCELLED' });
                        await updateBookingStatus(b.id, 'CANCELLED');
                        setPendingAction(null);
                      }
                    }}
                    disabled={pendingAction !== null}
                    style={{ background: '#ff4d4d22', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: pendingAction ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: pendingAction ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {pendingAction?.id === b.id && pendingAction?.action === 'CANCELLED' ? <><span className="btn-spinner" style={{ borderTopColor: '#ff4d4d' }}></span> Cancelling...</> : 'Cancel Booking'}
                  </button>
                  {b.transactionId && (
                    <RefundButton transactionId={b.transactionId} type="rental" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
