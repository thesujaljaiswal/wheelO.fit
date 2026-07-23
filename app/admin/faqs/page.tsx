import React from 'react';
import FAQClientView from './FAQClientView';
import { getFAQs } from './actions';

export default async function AdminFAQPage() {
  const faqs = await getFAQs();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>FAQ Management</h1>
      <FAQClientView faqs={faqs} />
    </div>
  );
}
