import React from 'react';
import { Carousel } from '../ui/Carousel';

const slides = [
  {
    id: 'classes',
    image: '/carousel_classes.png',
    title: 'High-Octane Cycling Classes',
    subtitle: 'Push your limits with our state-of-the-art indoor studio.',
    link: '/rides/cycle-classes'
  },
  {
    id: 'midnight',
    image: '/carousel_midnight.png',
    title: 'Mumbai Midnight Cycling',
    subtitle: 'Experience the city lights like never before.',
    link: '/rides/midnight-rides'
  },
  {
    id: 'sunday',
    image: '/carousel_sunday.png',
    title: 'Sunday Morning Rides',
    subtitle: 'Catch the sunrise on coastal routes with our community.',
    link: '/rides/sunday-morning'
  },
  {
    id: 'rental',
    image: '/carousel_rental.png',
    title: 'Premium Cycle Rentals',
    subtitle: 'Top-tier bikes available for your next adventure.',
    link: '/rides/rentals'
  }
];

export function HeroCarousel() {
  return <Carousel slides={slides} />;
}
