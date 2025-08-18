
import getAllHotels from "@/services/hotel/getAllHotels";
import getDestination from "@/services/hotel/getDestination";
import HotelSearch from "./HotelSearch";

export default async function Hotel() {
  // Server Side এ data fetch
  const destinations = await getDestination();
  const hotelsData = await getAllHotels();

  return (
    <main>
      <HotelSearch
        destinationsData={destinations}
        hotelsData={hotelsData}
      />
    </main>
  );
}
