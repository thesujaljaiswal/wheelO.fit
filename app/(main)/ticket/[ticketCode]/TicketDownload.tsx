'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';

type TicketData = {
  ticketCode: string;
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
};

export default function TicketDownload({ ticket }: { ticket: TicketData }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    setQrUrl(`${window.location.origin}/ticket/${ticket.ticketCode}`);
  }, [ticket.ticketCode]);

  const handleDownload = async () => {
    if (ticketRef.current === null) {
      return;
    }
    try {
      setDownloading(true);
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Wheelo_Ticket_${ticket.ticketCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download ticket', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
      <div 
        ref={ticketRef} 
        style={{
          background: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
          color: '#fff',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-80px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem', position: 'relative', zIndex: 1 }}>
          Wheelo Pass
        </h2>
        
        <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Event</p>
          <p style={{ fontSize: '1.4rem', fontWeight: '600' }}>{ticket.eventName}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Date</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{ticket.eventDate}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Time</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{ticket.eventTime}</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Attendee</p>
          <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{ticket.name}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '8px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Ticket Code</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '2px' }}>{ticket.ticketCode}</p>
          </div>
          {qrUrl && (
            <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '4px' }}>
              <QRCode value={qrUrl} size={80} level="M" />
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleDownload}
        disabled={downloading}
        style={{
          padding: '0.8rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: downloading ? 'not-allowed' : 'pointer',
          opacity: downloading ? 0.7 : 1,
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 10px rgba(255,255,255,0.2)'
        }}
      >
        {downloading ? 'Preparing Download...' : 'Download Ticket Image'}
      </button>
    </div>
  );
}
