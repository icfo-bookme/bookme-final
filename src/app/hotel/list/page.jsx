import HotelListClient from '@/app/components/hotel/HotelListing/HotelListClient';
import { fetchHotelListingData } from '@/services/hotel/hotelData';


export default async function HotelListPage({ searchParams }) {
  const { checkin, checkout, locationID, rooms = '1', adult = '2' } = searchParams;

  if (!locationID) {
    return <div className="container mx-auto py-16 text-center">Location ID is required</div>;
  }

  // Fetch data on the server
  const { hotels, amenities } = await fetchHotelListingData(locationID);

  return (
    <HotelListClient 
      searchParams={searchParams}
      initialHotels={hotels}
      initialAmenities={amenities}
    />
  );
}