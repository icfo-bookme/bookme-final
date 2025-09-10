
'use client';
import { useRef } from 'react';

export default function useScrollOnFocus(offset = 150, maxWidth = 640) {
  const ref = useRef(null);

  const handleFocus = () => {
    if (ref.current && window.innerWidth <= maxWidth) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return [ref, handleFocus];
}
