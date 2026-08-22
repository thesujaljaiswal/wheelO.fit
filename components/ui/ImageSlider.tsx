'use client';

import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: { id: string; img: string; }[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {images.map((img, index) => {
            const isActive = index === selectedIndex;
            return (
              <div className={styles.slide} key={img.id}>
                {/* Blurred Background Layer */}
                <Image src={img.img} alt="" className={styles.bgImage} fill priority={index === 0} style={{ objectFit: 'cover' }} />
                <div className={styles.bgOverlay} />
                
                {/* Main Foreground Image */}
                <motion.img 
                  src={img.img} 
                  alt="Gallery image"
                  className={styles.image} 
                  initial={{ scale: 1 }}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ duration: 4, ease: "linear" }}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
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
