export const revalidate = 60;

import HotelLoadingSkeleton from '@/app/components/hotel/Hotel/HotelLoadingSkeleton';
import HotelCTA from '@/app/components/hotel/Hotel/HotelCTA';
import getActivities from '@/services/Activities/getActivities';
import HeroSection from '../components/Activities/ActivitiesPage/HeroSection';
import ActivitiesCard from '../components/Activities/ActivitiesPage/ActivitiesCard';

// Helper function to calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

export default async function HotelHome() {
  let packages = [];
  let loading = false;

  try {
    loading = true;
    const propertyResult = await getActivities();
    packages = propertyResult;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch property data:", error);
    loading = false;
  }

  if (loading) {
    return <HotelLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* <DestinationSlider /> */}
      <main className="container mx-auto ">
        <section className="mt-12 ">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center mb-2 text-blue-950">
            Best Activities for Your Next Trip
          </h2>

          <ActivitiesCard packageData={packages} />
          {packages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No Activities found. Please try a different search.
            </div>
          )}
        </section>

        <HotelCTA />
      </main>
    </div>
  );
}