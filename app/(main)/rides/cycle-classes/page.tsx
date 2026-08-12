import React from 'react';
import styles from '../rides.module.css';
import CycleClassForm from '@/components/ui/CycleClassForm';
import CycleClassTabs from '@/components/ui/CycleClassTabs';
import WhyLearnWithUs from '@/components/ui/WhyLearnWithUs';
import { ImageSlider } from '@/components/ui/ImageSlider';
import EnquireModalFAB from '@/components/ui/EnquireModalFAB';

const happyCustomerImages = [
  { id: "1", img: "/cycling classes visuals/cycling-classes/Wheelofit cycling classes customer-1.jpg", height: 400 },
  { id: "2", img: "/cycling classes visuals/cycling-classes/Wheelofit cycling classes child-1.jpg", height: 250 },
  { id: "3", img: "/cycling classes visuals/cycling-classes/Wheelofit National park cycling ride solo-tour.jpg", height: 600 },
  { id: "4", img: "/cycling classes visuals/cycling-classes/Wheelofit cycling classes testimonial-img4.jpg", height: 350 },
  { id: "5", img: "/cycling classes visuals/cycling-classes/Wheelofit cycling classes customer-2.jpg", height: 450 },
];

export default async function CycleClassesPage() {
  return (
    <main>
      {/* Happy Customers (Top Banner) */}
      <div style={{ paddingTop: '100px', paddingBottom: '2rem', background: '#000' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#fff' }}>Cycle Classes - Happy Customers</h1>
        <ImageSlider images={happyCustomerImages} />
      </div>
      
      <div className={styles.content} style={{ display: 'block' }}>
        <div className={styles.description}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Learn to Ride a Cycle with Confidence</h2>
          
          <p>
            Whether you're learning to cycle for the very first time or looking to improve your riding skills, Wheelo.fit is here to guide you every step of the way.
          </p>
          <p>
            Our personalized cycling classes are designed for children and adults aged 5 to 75 years, making it easy for anyone to learn in a safe, supportive, and enjoyable environment. With experienced instructors and 1000+ successful learners across Mumbai, we help you build confidence and become an independent rider at your own pace.
          </p>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', marginTop: '2rem' }}>What You'll Learn</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 2rem 0' }}>
            <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✔</span> Choosing the right bicycle based on your height and comfort</li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✔</span> Understanding the essential parts of a bicycle and how they work</li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✔</span> Maintaining proper balance, posture, and riding techniques</li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✔</span> Using basic safety equipment and following road safety practices</li>
            <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--primary)' }}>✔</span> Building confidence to ride comfortably on roads and in different riding conditions</li>
          </ul>
          
          <p>
            Whether your goal is fitness, commuting, recreation, or simply fulfilling a lifelong dream of learning to cycle, our instructors will ensure you enjoy every step of the journey.
          </p>
          <p>
            Enrol in our cycling classes today and start a journey towards fitness, freedom, and fun! For more information, feel free to contact us via WhatsApp or by calling at +91 8879045474
          </p>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem 1.5rem', background: 'var(--surface)', borderLeft: '4px solid var(--primary)', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '1rem', color: '#ccc' }}>
              <strong>Please Note:</strong> We do not provide bicycles for children who are below 4'3" (130 cm) in height. They have to be arranged by clients, as it is not feasible for our trainers to transport and carry smaller bicycles during the training sessions.
            </p>
          </div>

          <CycleClassTabs />
        </div>
      </div>

      <WhyLearnWithUs />
      
      {/* Glimpses of cycling learners */}
      <div style={{ padding: '4rem 5%', background: '#0a0a0a', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>Glimpses of cycling learners</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { id: 1, title: 'First Pedal Strokes' },
            { id: 2, title: 'Road Safety Drill' },
            { id: 3, title: 'Graduation Ride' }
          ].map((video) => (
            <div 
              key={video.id} 
              className={styles.videoCard}
              style={{ 
                background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                aspectRatio: '16/9', 
                position: 'relative',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
              }}
            >
              {/* Play Button */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(30,181,58,0.2)',
                border: '1px solid rgba(30,181,58,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
                transition: 'transform 0.2s ease',
              }}>
                <div style={{
                  width: '0',
                  height: '0',
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '16px solid #1eb53a',
                  marginLeft: '4px'
                }}></div>
              </div>
              <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{video.title}</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Coming Soon</p>
              </div>
            </div>
          ))}
        </div>
      </div>





      {/* Testimonials */}
      <div style={{ padding: '6rem 5%', background: '#000', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(30,181,58,0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center' }}>Hear from our <span style={{ color: 'var(--primary)' }}>Happy Learners</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            
            {[
              { name: 'Rahul Desai', initials: 'RD', text: 'The trainers were extremely patient and professional. I learned how to ride confidently in just a few sessions. Highly recommended!' },
              { name: 'Sneha K.', initials: 'SK', text: 'My 8-year-old was struggling with balance, but the team here made learning so fun. He now rides every day without training wheels.' },
              { name: 'Amit Verma', initials: 'AV', text: 'Fantastic experience! The focus on safety and correct posture helped me get over my fear of riding on the main roads. Thank you!' }
            ].map((testimonial, i) => (
              <div key={i} 
              className={styles.testimonialCard}
              style={{ 
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.5))', 
                padding: '2.5rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(star => <div key={star} style={{ color: '#1eb53a', fontSize: '1.2rem' }}>★</div>)}
                </div>
                <p style={{ color: '#ddd', fontSize: '1.05rem', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '2rem', flex: 1 }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(30,181,58,0.1)', border: '1px solid rgba(30,181,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1eb53a', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>{testimonial.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Cycling Learner</div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
      <EnquireModalFAB />
    </main>
  );
}
