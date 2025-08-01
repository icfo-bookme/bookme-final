import getAllHotels from '@/services/hotel/getAllHotels';
import HotelLoadingSkeleton from '../components/hotel/Hotel/HotelLoadingSkeleton';
import HotelHeroSection from '../components/hotel/Hotel/HotelHeroSection';
import HotelCTA from '../components/hotel/Hotel/HotelCTA';
import Link from 'next/link';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import HotelCard from '../components/hotel/Hotel/HotelCard';
import DestinationSlider from '../components/hotel/Hotel/DestinationSlider';

// Helper function to calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

export default async function HotelHome() {
  let hotelData = [];
  let loading = false;

  try {
    loading = true;
    const hotelResult = await getAllHotels();
    hotelData = hotelResult;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch hotel data:", error);
    loading = false;
  }

  if (loading) {
    return <HotelLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <HotelHeroSection />

      <DestinationSlider />
      <main className="container mx-auto px-4 xs:px-6 mt-12  pb-12 sm:pb-16">
        <section className=" sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center mb-6 sm:mb-8 text-blue-950">
            Best Hotels for Your Next Trip
          </h2>

          <HotelCard hotelData={hotelData} />
          {hotelData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No hotels found. Please try a different search.
            </div>
          )}
        </section>

        <HotelCTA />
      </main>
    </div>
  );
}