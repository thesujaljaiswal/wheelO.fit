"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Route, Award } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Members', value: '1,200+' },
  { icon: Route, label: 'Routes Explored', value: '350+' },
  { icon: Award, label: 'Events Hosted', value: '50+' },
];

export function AboutSection() {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background glowing effects */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(74,222,128,0.03) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 1.5rem', 
              borderRadius: '9999px', 
              border: '1px solid rgba(74, 222, 128, 0.2)',
              background: 'rgba(74, 222, 128, 0.05)',
              color: '#4ade80',
              fontWeight: 500,
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              fontSize: '0.9rem',
              textTransform: 'uppercase'
            }}
          >
            Our Story
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Redefining the <span className="text-gradient">Cycling Culture</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'rgba(240, 247, 242, 0.7)', lineHeight: '1.8' }}
          >
            Wheelo isn't just about riding bikes; it's a movement dedicated to bringing riders together, exploring new horizons, and celebrating the journey. We provide the platform, the people, and the inspiration to keep you moving forward.
          </motion.p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          marginTop: '4rem'
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, background 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                background: 'rgba(74, 222, 128, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <stat.icon style={{ color: '#4ade80' }} size={32} />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
                {stat.value}
              </h3>
              <p style={{ color: 'rgba(240, 247, 242, 0.6)', fontSize: '1.1rem' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
