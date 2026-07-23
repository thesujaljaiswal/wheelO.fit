import React from 'react';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  // Ensure we have enough items to span a full ultra-wide monitor seamlessly
  let marqueeItems = [...testimonials];
  while (marqueeItems.length < 8) {
    marqueeItems = [...marqueeItems, ...testimonials];
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What <span className="text-gradient">Riders Say</span></h2>
          <p className={styles.subtitle}>Don't just take our word for it. Hear from the community that makes Wheelo special.</p>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContent}>
            {marqueeItems.map((testimonial, i) => (
              <div key={`original-${testimonial.id}-${i}`} className={styles.card}>
                <div className={styles.rating}>
                  {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                </div>
                <div className={styles.content}>
                  "{testimonial.content}"
                </div>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{testimonial.name}</h4>
                    {testimonial.role && <p>{testimonial.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.marqueeContent} aria-hidden="true">
            {marqueeItems.map((testimonial, i) => (
              <div key={`duplicate-${testimonial.id}-${i}`} className={styles.card}>
                <div className={styles.rating}>
                  {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                </div>
                <div className={styles.content}>
                  "{testimonial.content}"
                </div>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{testimonial.name}</h4>
                    {testimonial.role && <p>{testimonial.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
