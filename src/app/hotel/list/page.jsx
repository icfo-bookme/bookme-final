'use client';
import { Suspense } from 'react';

import LoadingSpinner from '@/utils/LoadingSpinner';
import HotelListContent from '@/app/components/hotel/HotelListing/HotelListContent';

const HotelListPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HotelListContent/>
    </Suspense>
  );
};

export default HotelListPage;