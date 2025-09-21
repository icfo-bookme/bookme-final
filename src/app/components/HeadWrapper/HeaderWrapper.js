'use client';

import { usePathname } from 'next/navigation';
import BookMeHeader from '../shared/BookMeHeader/BookmeHeader';


export default function HeaderWrapper() {
  const pathname = usePathname();
  return  <BookMeHeader /> ;
}