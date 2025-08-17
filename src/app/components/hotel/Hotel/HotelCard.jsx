"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

// Helper: Calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
  return Math.round(originalPrice * (1 - discount / 100));
}

// Helper: Find similar hotel names
function findSimilarHotels(searchTerm, hotels = []) {
  if (!searchTerm) return hotels;

  const lowerSearchTerm = searchTerm.toLowerCase();

  const exactMatches = hotels.filter(hotel =>
    hotel?.hotel_name?.toLowerCase().includes(lowerSearchTerm)
  );

  if (exactMatches.length > 0) return exactMatches;

  return hotels.filter(hotel => {
    const hotelName = hotel?.hotel_name?.toLowerCase() || "";
    return (
      hotelName.includes(lowerSearchTerm) ||
      lowerSearchTerm.includes(hotelName) ||
      hotelName.split(" ").some(word => word.startsWith(lowerSearchTerm)) ||
      lowerSearchTerm.split(" ").some(word => hotelName.startsWith(word))
    );
  });
}

const HotelCard = ({ hotelData = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const filteredHotels = useMemo(() => {
    if (!searchTerm) return hotelData;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return hotelData.filter(hotel =>
      hotel?.hotel_name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [hotelData, searchTerm]);

  const similarHotels = useMemo(
    () => findSimilarHotels(searchTerm, hotelData),
    [searchTerm, hotelData]
  );

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => setShowSuggestions(true);

  const selectSuggestion = hotelName => {
    setSearchTerm(hotelName);
    setShowSuggestions(false);
  };
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')                      // Replace spaces with dashes
    .replace(/[^\w\u0980-\u09FF\-]+/g, '')     // Allow Bangla + word chars + hyphen
    .replace(/\-\-+/g, '-');                   // Replace multiple dashes with one

  return (
    <div className="container mx-auto px-4">
      {/* Sticky Search Bar Container */}
      <div className="sticky top-16 z-20 bg-white lg:w-[50%] rounded-xl lg:mx-auto py-3 -mx-4 px-4 shadow-sm border-b border-gray-200">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search hotels by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full py-3 h-12 px-4 pr-12 rounded-lg border text-gray-800 border-gray-300 outline-none ring-2 ring-blue-500 border-transparent shadow-sm"
            />
            <FaSearch className="absolute right-4 text-gray-400" />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && similarHotels.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {similarHotels.map(hotel => (
                <div
                  key={hotel.hotel_id}
                  className="px-4 py-2 hover:bg-blue-50 text-gray-950 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => selectSuggestion(hotel.hotel_name)}
                >
                  <p className="font-medium">{hotel.hotel_name || "No Name"}</p>
                  <p className="text-sm text-gray-500 truncate flex gap-1">
                    <CiLocationOn className="text-gray-800 mt-[2px]" /> {hotel.street_address || "No address"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-4 pb-6">
        {filteredHotels?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredHotels?.map(hotel => {
              const originalPrice =
                Number(hotel?.original_price) || Number(hotel?.lowest_price) || 0;
              const discount = Number(hotel?.discount) || 0;
              const hasDiscount = discount > 0;
              const discountedPrice = hasDiscount
                ? calculateDiscountedPrice(originalPrice, discount)
                : originalPrice;

              const imageUrl = hotel?.image
                ? `${baseUrl}/storage/${hotel.image}`
                : "/default-hotel.jpg";

              return (
                <div
                  key={hotel.hotel_id}
                  className="bg-gray-100 w-[96%] mx-auto rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-40 sm:h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={hotel.hotel_name || "Hotel"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={hotel.sort_order === "1"}
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                       <Link
                        href={`/hotel/list/details/${slugify(hotel.hotel_name)}/${hotel.hotel_id}`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                          {hotel.hotel_name || "No Name"}
                        </h3>
                      </Link>
                      <div className="flex items-center text-yellow-700">
                        <FaStar className="text-sm mr-1" />
                        <span className="text-xs sm:text-sm font-medium border p-1 rounded-lg bg-gray-200">
                          {hotel.star_rating || "0"}
                          <span className="hidden md:inline ml-1">Star</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3">
                      <FaMapMarkerAlt className="mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {hotel.street_address || "Unknown location"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        {hasDiscount ? (
                          <>
                            <p className="text-2xs xs:text-xs text-gray-500">
                              Starting From
                            </p>
                            <p className="text-base sm:text-lg font-bold text-blue-600">
                              {discountedPrice.toLocaleString()} BDT
                              <span className="text-2xs font-normal text-gray-500">
                                {" "}
                                / night
                              </span>
                            </p>
                          </>
                        ) : (
                          <p className="text-base sm:text-lg font-bold text-blue-600">
                            {originalPrice.toLocaleString()} BDT
                            <span className="text-2xs font-normal text-gray-500">
                              {" "}
                              / night
                            </span>
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/hotel/list/details/${slugify(hotel.hotel_name)}/${hotel.hotel_id}`}
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
              {searchTerm
                ? `No hotels match "${searchTerm}". Try a different search term.`
                : "No hotels available at the moment."}
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
    </div>
  );
};

export default HotelCard;