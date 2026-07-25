import React from 'react';
import styles from '../rides.module.css';
import Masonry from '@/components/react-bits/Masonry';
import CycleClassForm from '@/components/ui/CycleClassForm';
import CycleClassTabs from '@/components/ui/CycleClassTabs';
import WhyLearnWithUs from '@/components/ui/WhyLearnWithUs';
import OurProcess from '@/components/ui/OurProcess';

const masonryItems = [
  { id: "1", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", url: "#", height: 400 },
  { id: "2", img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=600&auto=format&fit=crop", url: "#", height: 250 },
  { id: "3", img: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=600&auto=format&fit=crop", url: "#", height: 600 },
  { id: "4", img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=600&auto=format&fit=crop", url: "#", height: 350 },
  { id: "5", img: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop", url: "#", height: 450 },
  { id: "6", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", url: "#", height: 400 },
];

export default async function CycleClassesPage() {
  return (
    <main>
      <div className={styles.hero}>
        <img src="/cycle-classes-hero.png" alt="Cycle Classes" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <h1 className={styles.title}>Cycle Classes</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.description}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Are you looking to learn outdoor cycling?</h2>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#fff' }}>You're in the right place!</h3>
          
          <p>
            Our cycling classes are best suited for kids <strong>and adults across Mumbai, Thane, Navi Mumbai, Delhi, Bangalore, Kolkata</strong> who want to learn cycling. These classes can be taken by anyone aged between 6-64 years of age looking to learn cycling from scratch or just brush up their cycling skills. For the past 5 years, we have taught over 2500 people to cycle across 4 cities.
          </p>
          <p>
            Students will learn about choosing a bicycle, basic parts of a bike, essential equipment, as well as how to safely and comfortably ride your bike in various traffic conditions, terrain and climates. We also conduct cycling classes for those looking to build confidence to cycle independently on the road.
          </p>
          <p>
            Whatsapp or call us on +91 8928041081 to know more!
          </p>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem 1.5rem', background: 'var(--surface)', borderLeft: '4px solid var(--primary)', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1rem', color: '#ccc' }}>
              <strong>Please note:</strong> We do not provide kids bicycles for private classes. They have to be arranged by clients as it is not possible for our trainers to ride and carry them around.
            </p>
          </div>
          
          <p style={{ color: '#ccc', fontStyle: 'italic', marginBottom: '2rem' }}>
            Whether you want to <strong>learn cycling</strong> or just <strong>brush up your cycling skills</strong>, we accommodate all skill levels during each class.
          </p>

          <CycleClassTabs />
        </div>

        <div className={styles.formSection}>
          <div style={{ position: 'sticky', top: '100px', width: '100%' }}>
            <CycleClassForm />
          </div>
        </div>
      </div>

      <WhyLearnWithUs />
      
      <OurProcess />
      
      <div style={{ padding: '4rem 5%', marginTop: '2rem', background: 'transparent' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>Event Gallery</h2>
        <div style={{ position: 'relative' }}>
          <Masonry items={masonryItems} />
        </div>
      </div>
    </main>
  );
}
