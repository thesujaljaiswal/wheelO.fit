'use client';

import React, { useState, useEffect } from 'react';
import { getCycleAvailabilityMap, bookRental } from './actions';
import styles from '@/components/ui/BookingForm.module.css';

export default function RentalBookingForm({ cycles }: { cycles: any[] }) {
  const [step, setStep] = useState(1);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, number>>({});
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPricing, setSelectedPricing] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [maxQuantityForDate, setMaxQuantityForDate] = useState<number | null>(null);
  
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    if (selectedCycleId) {
      getCycleAvailabilityMap(selectedCycleId, currentMonth, currentYear).then(res => {
        if (res) setAvailabilityMap(res);
      });
      // Reset selections when cycle changes
      setSelectedDate('');
      setSelectedPricing(null);
      setQuantity(1);
      setMaxQuantityForDate(null);
    }
  }, [selectedCycleId, currentMonth, currentYear]);
  
  useEffect(() => {
    if (selectedDate && availabilityMap[selectedDate] !== undefined) {
      let minAvail = availabilityMap[selectedDate];
      
      // If a package is selected, find the minimum availability across the whole duration
      if (selectedPricing) {
        const durationDays = selectedPricing.durationValue;
        for (let i = 0; i < durationDays; i++) {
          const d = new Date(selectedDate);
          d.setDate(d.getDate() + i);
          const dStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
          
          if (availabilityMap[dStr] !== undefined) {
            minAvail = Math.min(minAvail, availabilityMap[dStr]);
          }
        }
      }
      
      setMaxQuantityForDate(minAvail);
      if (quantity > minAvail) setQuantity(Math.max(1, minAvail));
    }
  }, [selectedDate, selectedPricing, availabilityMap]);

  const selectedCycle = cycles.find(c => c.id === selectedCycleId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedPricing || !selectedCycleId) return;
    
    setPending(true);
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('cycleId', selectedCycleId);
    formData.append('startDate', selectedDate);
    formData.append('durationValue', selectedPricing.durationValue.toString());
    formData.append('durationUnit', selectedPricing.durationUnit);
    formData.append('quantity', quantity.toString());
    
    const res = await bookRental(formData);
    
    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else if (res?.success) {
      setMessage({ type: 'success', text: res.success });
      form.reset();
      setSelectedDate('');
      setSelectedCycleId('');
      setSelectedPricing(null);
      setQuantity(1);
      // Refresh availability
      getCycleAvailabilityMap(selectedCycleId, currentMonth, currentYear).then(res => {
        if (res) setAvailabilityMap(res);
      });
    }
    
    setPending(false);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      // Format as YYYY-MM-DD local
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isPast = dateObj < today;
      const availableQty = availabilityMap[dateStr];
      const isAvailable = availableQty !== undefined && availableQty > 0;
      const isSelected = selectedDate === dateStr;
      
      let bgColor = '#222';
      let cursor = 'default';
      let opacity = 1;
      
      if (isPast) {
        opacity = 0.3;
      } else if (availabilityMap[dateStr] !== undefined) {
        if (isAvailable) {
          bgColor = isSelected ? '#1eb53a' : '#1eb53a44';
          cursor = 'pointer';
        } else {
          bgColor = '#ff4d4d44';
          opacity = 0.5;
        }
      }

      days.push(
        <div 
          key={d} 
          onClick={() => {
            if (!isPast && isAvailable) setSelectedDate(dateStr);
          }}
          style={{ 
            background: bgColor, 
            opacity, 
            cursor, 
            padding: '1rem', 
            textAlign: 'center', 
            borderRadius: '4px',
            border: isSelected ? '2px solid #fff' : '1px solid #444',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>{d}</span>
          {!isPast && availableQty !== undefined && (
            <span style={{ fontSize: '0.7rem', color: isAvailable ? (isSelected ? '#fff' : '#1eb53a') : '#ff4d4d', marginTop: '4px' }}>
              {isAvailable ? `${availableQty} left` : 'Sold out'}
            </span>
          )}
        </div>
      );
    }

    return (
      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button type="button" onClick={prevMonth} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>&larr;</button>
          <h3 style={{ margin: 0 }}>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button type="button" onClick={nextMonth} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>&rarr;</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>{day}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {days}
        </div>
      </div>
    );
  };

  if (cycles.length === 0) {
    return <p style={{ textAlign: 'center', color: '#888' }}>No cycles available for rent currently.</p>;
  }

  return (
    <div className={styles.formContainer} style={{ width: '100%', maxWidth: '600px', margin: '0 auto', background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
      
      {/* Stepper Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '2px', background: '#333', zIndex: 0 }}></div>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: step >= s ? '#1eb53a' : '#222', 
              color: step >= s ? '#fff' : '#888',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', border: `2px solid ${step >= s ? '#1eb53a' : '#444'}`
            }}>
              {step > s ? '✓' : s}
            </div>
            <span style={{ fontSize: '0.8rem', color: step >= s ? '#fff' : '#888' }}>
              {s === 1 ? 'Cycle' : s === 2 ? 'Date' : s === 3 ? 'Package' : 'Details'}
            </span>
          </div>
        ))}
      </div>

      {message && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', background: message.type === 'error' ? '#ff4d4d22' : '#1eb53a22', color: message.type === 'error' ? '#ff4d4d' : '#1eb53a', border: `1px solid ${message.type === 'error' ? '#ff4d4d' : '#1eb53a'}` }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        
        {step === 1 && (
          <div className="step-content">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Choose your ride</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cycles.map(c => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: selectedCycleId === c.id ? '#1eb53a22' : '#222', border: `1px solid ${selectedCycleId === c.id ? '#1eb53a' : '#444'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="cycleSelection" 
                    checked={selectedCycleId === c.id} 
                    onChange={() => setSelectedCycleId(c.id)} 
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{c.type}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setStep(2)} disabled={!selectedCycleId} className={styles.submitBtn} style={{ width: 'auto', padding: '0.8rem 2rem', opacity: !selectedCycleId ? 0.5 : 1 }}>Next &rarr;</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Select Start Date</h3>
            {renderCalendar()}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}>&larr; Back</button>
              <button type="button" onClick={() => setStep(3)} disabled={!selectedDate} className={styles.submitBtn} style={{ width: 'auto', padding: '0.8rem 2rem', opacity: !selectedDate ? 0.5 : 1 }}>Next &rarr;</button>
            </div>
          </div>
        )}

        {step === 3 && selectedCycle && (
          <div className="step-content">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Select Duration & Quantity</h3>
            <div className={styles.field}>
              <label className={styles.label}>Pricing Package</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedCycle.pricing.map((p: any, i: number) => {
                  const isSelected = selectedPricing?.durationValue === p.durationValue && selectedPricing?.durationUnit === p.durationUnit;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedPricing(p)}
                      style={{ padding: '1rem', background: isSelected ? '#1eb53a' : '#222', color: isSelected ? '#fff' : '#ccc', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444', flex: '1 1 120px', textAlign: 'center' }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '0.2rem', fontSize: '1.1rem' }}>{p.durationLabel}</div>
                      <div>₹{p.price}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPricing && maxQuantityForDate !== null && (
              <div className={styles.field} style={{ marginTop: '1.5rem' }}>
                <label className={styles.label}>Quantity (Max {maxQuantityForDate} available)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#222', padding: '0.5rem', borderRadius: '8px', border: '1px solid #444', width: 'fit-content' }}>
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: '#333', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '6px', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '40px', textAlign: 'center', color: '#fff' }}>{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(Math.min(maxQuantityForDate, quantity + 1))} 
                    disabled={quantity >= maxQuantityForDate}
                    style={{ background: quantity >= maxQuantityForDate ? '#222' : '#333', color: quantity >= maxQuantityForDate ? '#555' : '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '6px', fontSize: '1.2rem', cursor: quantity >= maxQuantityForDate ? 'not-allowed' : 'pointer' }}
                  >+</button>
                </div>
                <input type="hidden" name="quantity" value={quantity} />
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(2)} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}>&larr; Back</button>
              <button type="button" onClick={() => setStep(4)} disabled={!selectedPricing} className={styles.submitBtn} style={{ width: 'auto', padding: '0.8rem 2rem', opacity: !selectedPricing ? 0.5 : 1 }}>Next &rarr;</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Contact Details</h3>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input type="text" name="name" required className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input type="email" name="email" required className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input type="tel" name="phone" required className={styles.input} />
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStep(3)} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}>&larr; Back</button>
              <button 
                type="submit" 
                disabled={pending} 
                className={styles.submitBtn}
                style={{ width: 'auto', padding: '0.8rem 2rem', opacity: pending ? 0.5 : 1, cursor: pending ? 'not-allowed' : 'pointer' }}
              >
                {pending ? <><span className="btn-spinner"></span> Booking...</> : 'Confirm Rental Booking'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
