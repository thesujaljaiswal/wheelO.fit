'use client';

import React, { useState } from 'react';
import { createRentalCycle } from './actions';

export default function CreateCycleForm() {
  const [pricingOptions, setPricingOptions] = useState([{ label: '1 Day', value: 1, unit: 'DAYS', price: 500 }]);
  const [pending, setPending] = useState(false);

  const addPricingOption = () => {
    setPricingOptions([...pricingOptions, { label: '', value: 1, unit: 'DAYS', price: 0 }]);
  };

  const removePricingOption = (index: number) => {
    setPricingOptions(pricingOptions.filter((_, i) => i !== index));
  };

  const handlePricingChange = (index: number, field: string, val: string | number) => {
    const newOptions = [...pricingOptions];
    newOptions[index] = { ...newOptions[index], [field]: val };
    setPricingOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    await createRentalCycle(formData);
    form.reset();
    setPricingOptions([{ label: '1 Day', value: 1, unit: 'DAYS', price: 500 }]);
    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Cycle Type (e.g., Mountain Bike)</label>
        <input type="text" name="type" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Total Quantity Available</label>
        <input type="number" name="quantity" min="1" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} />
      </div>

      <div style={{ background: '#222', padding: '1rem', borderRadius: '6px', border: '1px solid #333' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
          Pricing Options
          <button type="button" onClick={addPricingOption} style={{ background: '#1eb53a', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Option</button>
        </h3>
        
        <style>
          {`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            input[type="number"] {
              -moz-appearance: textfield;
            }
            @media (max-width: 600px) {
              .pricing-header {
                display: none !important;
              }
              .pricing-row {
                flex-direction: column !important;
                align-items: stretch !important;
                border: 1px solid #444;
                padding: 1rem;
                border-radius: 6px;
                margin-bottom: 1rem !important;
              }
              .pricing-row input {
                width: 100% !important;
              }
              .pricing-row button {
                width: 100% !important;
                margin-top: 0.5rem;
              }
            }
          `}
        </style>
        
        <div className="pricing-header" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1, fontSize: '0.8rem', color: '#888' }}>Label (e.g. 1 Week)</div>
          <div style={{ width: '60px', fontSize: '0.8rem', color: '#888' }}>Time</div>
          <div style={{ width: '80px', fontSize: '0.8rem', color: '#888' }}>Price (₹)</div>
          <div style={{ width: '30px' }}></div>
        </div>

        {pricingOptions.map((opt, index) => (
          <div key={index} className="pricing-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input 
              type="text" 
              name={`pricingLabel_${index}`} 
              placeholder="e.g. 1 Day" 
              value={opt.label}
              onChange={e => handlePricingChange(index, 'label', e.target.value)}
              required 
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }}
            />
            <input 
              type="number" 
              name={`pricingValue_${index}`} 
              placeholder="Days" 
              value={opt.value}
              onChange={e => handlePricingChange(index, 'value', Number(e.target.value))}
              required 
              min="1"
              style={{ width: '60px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }}
            />
            <input type="hidden" name={`pricingUnit_${index}`} value="DAYS" />
            <input 
              type="number" 
              name={`pricingPrice_${index}`} 
              placeholder="Price" 
              value={opt.price}
              onChange={e => handlePricingChange(index, 'price', Number(e.target.value))}
              required 
              min="0"
              style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#111', color: '#fff' }}
            />
            {pricingOptions.length > 1 ? (
              <button type="button" onClick={() => removePricingOption(index)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}>&times;</button>
            ) : (
              <div style={{ width: '30px' }}></div>
            )}
          </div>
        ))}
      </div>

      <button type="submit" disabled={pending} style={{ padding: '0.8rem', background: '#e3ff00', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: pending ? 'not-allowed' : 'pointer', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {pending ? <><span className="btn-spinner" style={{ borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#000' }}></span> Adding...</> : 'Add Cycle to Inventory'}
      </button>
    </form>
  );
}
