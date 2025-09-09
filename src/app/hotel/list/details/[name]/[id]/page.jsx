
import HotelHashRoute from "@/app/components/hotel/hotelHashRote";
import getHotelDetails from "@/services/hotel/gethoteldetails";

export default async function HotelDetailsPage({ params, searchParams }) {

   const hotelDetails = await getHotelDetails(params.id);
    const { checkin, checkout, rooms, adult } = searchParams;
   
  return (
    <div className=" pt-16 min-h-screen bg-gray-200">
      
      <div className=" ">
        <HotelHashRoute hotelId={params.id} initialHotelDetails={hotelDetails}  checkin={checkin}
        checkout={checkout} />
      </div>

    </div>
  );
}