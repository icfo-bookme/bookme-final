"use client"
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

// Helper function to calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

// Helper function to find similar hotel names
function findSimilarHotels(searchTerm, hotels) {
  if (!searchTerm) return hotels; // Return first 5 hotels when search is empty

  const lowerSearchTerm = searchTerm.toLowerCase();

  // First try exact matches
  const exactMatches = hotels.filter(hotel =>
    hotel.hotel_name.toLowerCase().includes(lowerSearchTerm)
  );

  if (exactMatches.length > 0) return exactMatches;

  // If no exact matches, try fuzzy matching
  return hotels.filter(hotel => {
    const hotelName = hotel.hotel_name.toLowerCase();
    return (
      hotelName.includes(lowerSearchTerm) ||
      lowerSearchTerm.includes(hotelName) ||
      hotelName.split(' ').some(word => word.startsWith(lowerSearchTerm)) ||
      lowerSearchTerm.split(' ').some(word => hotelName.startsWith(word))
    );
  }); // Limit to 5 suggestions
}

const HotelCard = ({ hotelData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter hotels based on search term
  const filteredHotels = useMemo(() => {
    if (!searchTerm) return hotelData;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return hotelData.filter(hotel =>
      hotel.hotel_name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [hotelData, searchTerm]);

  // Get similar hotels for suggestions
  const similarHotels = useMemo(() =>
    findSimilarHotels(searchTerm, hotelData),
    [searchTerm, hotelData]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const selectSuggestion = (hotelName) => {
    setSearchTerm(hotelName);
    setShowSuggestions(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search hotels by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <FaSearch className="absolute right-4 text-gray-400" />
        </div>

        {/* Suggestions dropdown - shows all hotels when empty */}
        {showSuggestions && similarHotels.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {similarHotels.map((hotel) => (
              <div
                key={hotel.hotel_id}
                className="px-4 py-2 hover:bg-blue-50 text-gray-950 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => selectSuggestion(hotel.hotel_name)}
              >
                <p className="font-medium">{hotel.hotel_name}</p>
                <p className="text-sm text-gray-500 truncate">{hotel.street_address}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotels Grid - shows all when empty, filtered when searching */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredHotels.map((hotel) => {
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

                  <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-100">
                    <div>
                      {hasDiscount ? (
                        <>
                          <p className="text-2xs xs:text-xs text-gray-500">
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
                      href={`/hotel/list/details/${hotel.hotel_id}`}
                      prefetch={true}  // Add this line
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)",
                      }}
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
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No hotels found</h3>
          <p className="text-gray-500 mt-2">
            {searchTerm ?
              `No hotels match "${searchTerm}". Try a different search term.` :
              'No hotels available at the moment.'}
          </p>

          {searchTerm && similarHotels.length > 0 && (
            <div className="mt-6 max-w-md mx-auto">
              <h4 className="font-medium text-gray-700 mb-2">Did you mean:</h4>
              <div className="grid gap-2">
                {similarHotels.map(hotel => (
                  <button
                    key={hotel.hotel_id}
                    onClick={() => selectSuggestion(hotel.hotel_name)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                  >
                    {hotel.hotel_name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelCard;