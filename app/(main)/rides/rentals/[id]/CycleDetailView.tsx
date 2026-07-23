'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RentalBookingForm from '@/app/(main)/rentals/RentalBookingForm';
import HeightChartModal from '../HeightChartModal';

export default function CycleDetailView({ cycle }: { cycle: any }) {
  const [isHeightChartOpen, setIsHeightChartOpen] = useState(false);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1rem 2rem 1rem' }}>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left Side: Cycle Display */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#f5f4ef', borderRadius: '16px', padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#eab30822', color: '#eab308', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              ⚡ {cycle.speed || 'Single Speed'}
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
              {cycle.imageUrl ? (
                <img src={cycle.imageUrl} alt={cycle.type} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
              )}
            </div>

            <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span>For Heights : {cycle.tyreSize ? cycle.tyreSize.split('(')[1]?.replace(')', '') : "4'7 to 5'1 ft"}</span>
              <span 
                onClick={() => setIsHeightChartOpen(true)}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                Height Chart
              </span>
            </div>
          </div>
          
          <div style={{ background: '#0284c711', borderRadius: '16px', padding: '1.5rem', border: '1px solid #0284c722' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#fff' }}>Specifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Speed</div><div style={{ color: '#fff', fontWeight: '500' }}>{cycle.speed || 'Single Speed'}</div></div>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Brakes</div><div style={{ color: '#fff', fontWeight: '500' }}>{cycle.brakes || 'Power'}</div></div>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Tyre Size</div><div style={{ color: '#fff', fontWeight: '500' }}>{cycle.tyreSize || '24 Inches'}</div></div>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Seat</div><div style={{ color: '#fff', fontWeight: '500' }}>Adjustable</div></div>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #333' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#fff' }}>Additional Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Price Includes</div><div style={{ color: '#fff', fontWeight: '500' }}>Lock, Seat Cover, Bottle Holder</div></div>
              <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#888' }}>Security Deposit</div><div style={{ color: '#fff', fontWeight: '500' }}>Rs. 1,000</div></div>
            </div>
            
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1.5rem', lineHeight: '1.4' }}>
              *Actual cycle may differ from the photo<br/>
              *Please go through our FAQs before availing any of our services. By subscribing to WheelO you are adhering to all our Terms & Conditions and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Right Side: Booking UI */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 1.5rem 0', color: '#fff' }}>{cycle.type}</h1>
          <RentalBookingForm 
            cycles={[cycle]} 
            preselectedCycleId={cycle.id} 
          />
        </div>
      </div>
      <HeightChartModal isOpen={isHeightChartOpen} onClose={() => setIsHeightChartOpen(false)} />
    </div>
  );
}
