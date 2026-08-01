import React from 'react';
import prisma from '@/lib/prisma';
import { HeroCarousel } from '@/components/landing/HeroCarousel';
import { AboutSection } from '@/components/landing/AboutSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import DomeGallery from '@/components/react-bits/DomeGallery';
import { TestimonialsSection } from '@/components/landing/Testimonials';
import { InstagramWidget } from '@/components/landing/InstagramWidget';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop', alt: 'Cycling group' },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop', alt: 'Bicycles' },
  { src: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=800&auto=format&fit=crop', alt: 'Event people' },
  { src: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop', alt: 'Person on bike' },
  { src: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=800&auto=format&fit=crop', alt: 'Community' },
  { src: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop', alt: 'Riding at sunset' },
  { src: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=800&auto=format&fit=crop', alt: 'Happy community' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', alt: 'Team' },
];

export default async function Home() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main>
      <HeroCarousel />
      <AboutSection />
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Step Into <span className="text-gradient">Our World</span>
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(240, 247, 242, 0.7)', lineHeight: '1.6' }}>
            More than a gallery—this is the heartbeat of our community. Explore the rides, the faces, and the moments that bring the Wheelo family together.
          </p>
        </div>
        <div style={{ width: '100%', height: '700px', position: 'relative', overflow: 'hidden', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)' }}>
          <DomeGallery images={galleryImages} overlayBlurColor="transparent" />
        </div>
      </section>
      <ServicesSection />
      <InstagramWidget />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
