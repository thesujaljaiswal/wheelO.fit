'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '../react-bits/BlurText';
import Link from 'next/link';
import styles from './Carousel.module.css';

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
}

export function Carousel({ slides }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 8000);
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            return (
              <Link href={slide.link} className={styles.slide} key={slide.id}>
                <div className={styles.imageWrapper}>
                  <motion.img 
                    src={slide.image} 
                    alt={slide.title} 
                    className={styles.image} 
                    initial={{ scale: 1 }}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ duration: 8, ease: "linear" }}
                  />
                  <div className={styles.overlay} />
                </div>
                
                <div className={styles.content}>
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <BlurText 
                          text={slide.title} 
                          className={styles.title} 
                          delay={50}
                        />
                        <motion.p 
                          className={styles.subtitle}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        >
                          {slide.subtitle}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => emblaApi?.scrollPrev()}>&#10094;</button>
        <button className={styles.btn} onClick={() => emblaApi?.scrollNext()}>&#10095;</button>
      </div>
    </div>
  );
}
