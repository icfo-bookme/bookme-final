import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// Helper function to calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

const HotelCard = ({ hotelData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {hotelData.map((hotel) => {
        // Calculate prices
        const originalPrice = Number(hotel.original_price) || hotel.lowest_price || 0;
        const hasDiscount = hotel.discount > 0;
        const discountedPrice = hasDiscount
          ? calculateDiscountedPrice(originalPrice, hotel.discount)
          : originalPrice;

        return (
          <div
            key={hotel.hotel_id}
            className="bg-gray-100 w-[96%] mx-auto rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Hotel Image */}
            <div className="relative h-40 sm:h-48 w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${hotel.image}`}
                alt={hotel.hotel_name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={hotel.sort_order === "1"}
              />
              {hasDiscount && (
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {hotel.discount}% OFF
                </div>
              )}
            </div>

            {/* Hotel Info */}
            <div className="p-3 sm:p-4">
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                  {hotel.hotel_name}
                </h3>
                <div className="flex items-center text-yellow-700">
                  <FaStar className="text-xs sm:text-sm mr-0.5 sm:mr-1" />
                  <span className="text-xs flex sm:text-sm font-medium border p-1 rounded-lg bg-gray-200">
                    {hotel.star_rating}  <span className='hidden md:block ml-1'> Star</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                <FaMapMarkerAlt className="mr-1 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{hotel.street_address}</span>
              </div>

              {/* Price Section */}
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-100">
                <div>
                  {hasDiscount ? (
                    <>
                      <p className="text-2xs xs:text-xs text-gray-500 ">
                        Starting From
                      </p>
                     
                      <p className="text-base sm:text-lg font-bold text-blue-600">
                        {discountedPrice.toLocaleString()} BDT
                        <span className="text-2xs xs:text-xs font-normal text-gray-500"> / night</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-base sm:text-lg font-bold text-blue-600">
                      {originalPrice.toLocaleString()} BDT
                      <span className="text-2xs xs:text-xs font-normal text-gray-500"> / night</span>
                    </p>
                  )}
                </div>
                <Link
                  style={{
                    background: "linear-gradient(90deg, #313881, #0678B4)",
                  }}
                  href={`/hotel/list/details/${hotel.hotel_id}`}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HotelCard;