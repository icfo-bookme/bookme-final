import HotelSearch from "@/components/HotelSearch";
import getDestination from "@/services/hotel/getDestination";

export default async function Home() {
  // Fetch destinations on the server side
  const destinations = await getDestination();
  const initialSelectedLocationId = destinations.length > 0 ? destinations[0].id : "";

  return (
    <main>
      <HotelSearch 
        serverDestinations={destinations} 
        initialSelectedLocationId={initialSelectedLocationId} 
      />
    </main>
  );
}