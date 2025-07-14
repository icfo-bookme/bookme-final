// app/hotel/list/details/[id]/page.jsx
import HotelDetails from "@/app/components/hotel/hoteldetails";
import HotelHashRoute from "@/app/components/hotel/hotelHashRote";
import HotelCarousel from "@/app/components/hotel/HotelSlider";

export default function HotelDetailsPage({ params }) {
  return (
    <div className="pt-24 min-h-screen bg-gray-200">
      <div className="container  mx-auto grid grid-cols-1 bg-white md:grid-cols-12 gap-4 md:p-4">
        <div className="col-span-1 md:col-span-8 bg-white ">
            <HotelCarousel hotelId={params.id} />
        </div>
        <div className="col-span-1 md:col-span-4 bg-white p-4">
          <HotelDetails hotelId={params.id} />
        </div>
      </div>
      <div className="container mx-auto mt-5">
        <HotelHashRoute hotelId={params.id} />
      </div>

    </div>
  );
}