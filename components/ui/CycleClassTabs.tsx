'use client';

import React, { useState } from 'react';

export default function CycleClassTabs() {
  const [activeTab, setActiveTab] = useState('carry');

  const tabs = [
    { id: 'carry', label: 'Things to carry' },
    { id: 'wear', label: 'Things to wear' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'consent', label: 'Download Consent form' },
    { id: 'faqs', label: 'FAQs' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'carry':
        return (
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li>Bottle of water</li>
            <li>Hand towel</li>
            <li>Medicine if any</li>
          </ol>
        );
      case 'wear':
        return <p>Comfortable activewear, sports shoes. Avoid loose clothing near the chain.</p>;
      case 'terms':
        return <p>Classes are non-refundable. Please arrive 10 minutes early. Safety gear is mandatory.</p>;
      case 'consent':
        return <p><a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Click here to download the consent form</a>. Must be signed before your first class.</p>;
      case 'faqs':
        return <p><strong>Do I need my own cycle?</strong> No for adults, yes for kids.</p>;
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginBottom: '1.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.8rem 1.5rem',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
              color: activeTab === tab.id ? '#fff' : '#ccc',
              cursor: 'pointer',
              fontWeight: '500',
              flex: '1 1 auto',
              transition: 'background 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ 
        background: 'transparent', 
        padding: '0.5rem', 
        color: '#eee',
        minHeight: '120px'
      }}>
        {renderContent()}
      </div>
    </div>
  );
}
