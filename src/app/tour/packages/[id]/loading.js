import HotelLoadingSkeleton from "@/app/components/hotel/Hotel/HotelLoadingSkeleton";


export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <HotelLoadingSkeleton />
    </div>
  );
}
