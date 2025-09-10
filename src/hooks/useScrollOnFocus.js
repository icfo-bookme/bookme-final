'use client';
import { useRef } from 'react';

export default function useScrollOnClick(offset = 150, maxWidth = 640) {
  const ref = useRef(null);

  const handleClick = () => {
    if (!ref.current) return;

    // Only apply on small screens
    if (window.innerWidth > maxWidth) return;

    const elementTop = ref.current.getBoundingClientRect().top + window.scrollY;
    const currentScrollY = window.scrollY;

    // Only scroll if the element is below the offset
    if (elementTop - offset > currentScrollY) {
      const targetScroll = elementTop - offset;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return [ref, handleClick];
}
