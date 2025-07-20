// app/hotel/list/details/[id]/page.jsx
import HotelDetails from "@/app/components/hotel/hoteldetails";
import HotelHashRoute from "@/app/components/hotel/hotelHashRote";
import HotelCarousel from "@/app/components/hotel/HotelSlider";

export default function HotelDetailsPage({ params }) {
  return (
    <div className="md:pt-24 pt-20 min-h-screen bg-gray-200">
      <div className="md:w-[85%] w-[96%] p-2 md:p-4 rounded-lg  mx-auto grid grid-cols-1 bg-white md:grid-cols-10 gap-4 md:p-4">
        <div className="col-span-1 md:col-span-7 bg-white ">
            <HotelCarousel hotelId={params.id} />
        </div>
        <div className="col-span-1 md:col-span-3 bg-white p-4">
          <HotelDetails hotelId={params.id} />
        </div>
      </div>
      <div className=" mx-auto mt-5">
        <HotelHashRoute hotelId={params.id} />
      </div>

    </div>
  );
}