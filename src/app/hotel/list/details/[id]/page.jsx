// app/hotel/list/details/[id]/page.jsx
import HotelDetails from "@/app/components/hotel/hoteldetails";
import HotelHashRoute from "@/app/components/hotel/hotelHashRote";
import HotelCarousel from "@/app/components/hotel/HotelSlider";
import getHotelDetails from "@/services/hotel/gethoteldetails";

export default async function HotelDetailsPage({ params }) {

   const hotelDetails = await getHotelDetails(params.id);
   
  return (
    <div className=" pt-20 min-h-screen bg-gray-200">
      
      <div className=" ">
        <HotelHashRoute hotelId={params.id} initialHotelDetails={hotelDetails} />
      </div>

    </div>
  );
}