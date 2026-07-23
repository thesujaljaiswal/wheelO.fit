'use client';

import { useState } from 'react';
import { submitCycleClassInquiry } from '@/app/(main)/rides/cycle-classes/actions';
import styles from '@/components/ui/BookingForm.module.css';

export default function CycleClassForm() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setSuccess(null);
    setError(null);

    const res = await submitCycleClassInquiry(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      (document.getElementById('cycle-class-form') as HTMLFormElement)?.reset();
    }
    
    setPending(false);
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>Inquire About Cycle Classes</h3>
      
      {success && <div style={{ color: '#4dff4d', background: 'rgba(77,255,77,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
      {error && <div style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      <form id="cycle-class-form" action={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input type="text" id="name" name="name" required className={styles.input} placeholder="John Doe" />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input type="email" id="email" name="email" required className={styles.input} placeholder="john@example.com" />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <input type="tel" id="phone" name="phone" required className={styles.input} placeholder="+91 9876543210" />
        </div>

        <div className={styles.field}>
          <label htmlFor="experienceLevel" className={styles.label}>Experience Level</label>
          <select id="experienceLevel" name="experienceLevel" className={styles.select}>
            <option value="Beginner">Beginner - Never ridden before</option>
            <option value="Intermediate">Intermediate - Know how to balance</option>
            <option value="Advanced">Advanced - Want to improve technique</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>Any specific goals or questions? (Optional)</label>
          <textarea id="message" name="message" className={styles.input} rows={4} placeholder="Tell us what you want to achieve..."></textarea>
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={pending}
          style={{ opacity: pending ? 0.7 : 1, cursor: pending ? 'not-allowed' : 'pointer' }}
        >
          {pending ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
