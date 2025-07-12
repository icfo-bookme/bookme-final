'use client';

import { usePathname } from 'next/navigation';
import BookMeHeader from '../shared/BookMeHeader/BookmeHeader';
import Header from '../shared/Header/Header';


export default function HeaderWrapper() {
  const pathname = usePathname();
  return  <BookMeHeader /> ;
}