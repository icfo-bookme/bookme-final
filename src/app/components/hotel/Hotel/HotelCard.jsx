"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

// Helpers
const calculateDiscountedPrice = (originalPrice, discount) =>
  Math.round(originalPrice * (1 - discount / 100));

const findSimilarHotels = (searchTerm, hotels = []) => {
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
};

const HotelCard = ({ hotelData = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const loaderRef = useRef(null);

  const filteredHotels = useMemo(() => {
    if (!searchTerm) return hotelData;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return hotelData.filter(hotel =>
      hotel?.hotel_name?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [hotelData, searchTerm]);

  const visibleHotels = filteredHotels.slice(0, visibleCount);

  const similarHotels = useMemo(
    () => findSimilarHotels(searchTerm, hotelData),
    [searchTerm, hotelData]
  );

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setVisibleCount(12);
  };

  const handleSearchFocus = () => setShowSuggestions(true);
  const selectSuggestion = hotelName => {
    setSearchTerm(hotelName);
    setShowSuggestions(false);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const slugify = str =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0980-\u09FF\-]+/g, "")
      .replace(/\-\-+/g, "-");


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < filteredHotels.length) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, filteredHotels.length]);

  return (
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div className=" top-16 z-20 bg-white rounded-xl lg:w-[50%] lg:mx-auto py-3 shadow-sm border-b border-gray-200 -mx-4 px-4">
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
                    <CiLocationOn className="text-gray-800 mt-[2px]" />{" "}
                    {hotel.street_address || "No address"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="pt-4 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleHotels.length > 0 ? (
          visibleHotels.map(hotel => {
            const originalPrice =
              Number(hotel?.original_price) ||
              Number(hotel?.lowest_price) ||
              0;
            const discount = Number(hotel?.discount) || 0;
            const hasDiscount = discount > 0;
            const discountedPrice = hasDiscount
              ? calculateDiscountedPrice(originalPrice, discount)
              : originalPrice;
            const imageUrl = `${baseUrl}/storage/${hotel.image}`;

            return (
              <div
                key={hotel.hotel_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform duration-300 flex flex-col"
              >
                <div className="relative h-40 sm:h-48 w-full flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={hotel.hotel_name || "Hotel"}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={`/hotel/list/details/${slugify(
                          hotel.hotel_name
                        )}/${hotel.hotel_id}`}
                      >
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                          {hotel.hotel_name || "No Name"}
                        </h3>
                      </Link>
                      <div className="flex items-center text-yellow-700">
                        <FaStar className="text-sm mr-1" />
                        <span className="text-xs sm:text-sm font-medium border p-1 rounded-lg bg-gray-200">
                          {hotel.star_rating || "0"}{" "}
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
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                    <div>
                      {discountedPrice ? (
                        <p className="text-base sm:text-lg font-bold text-blue-600">
                          {discountedPrice.toLocaleString()} BDT
                          <span className="text-2xs font-normal text-gray-500"> / night</span>
                        </p>
                      ) : (
                        <p className="text-sm text-blue-500 font-medium">Contact for price</p>
                      )}

                    </div>
                    <Link
                      href={`/hotel/list/details/${slugify(
                        hotel.hotel_name
                      )}/${hotel.hotel_id}`}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">
              No hotels found
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? `No hotels match "${searchTerm}".`
                : "No hotels available at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Loader Trigger for Infinite Scroll */}
      {visibleCount < filteredHotels.length && (
        <div ref={loaderRef} className="text-center py-6 text-gray-500">
          Loading more hotels...
        </div>
      )}
    </div>
  );
};

export default HotelCard;
