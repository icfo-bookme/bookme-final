'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/app/components/hotel/SearchBar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Wrap the main component with Suspense to handle useSearchParams
const HotelListPage = () => {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <HotelListContent />
    </Suspense>
  );
};

// Move the main content to a separate component
const HotelListContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const locationID = searchParams.get('locationID');
  const rooms = searchParams.get('rooms') || '1';
  const adult = searchParams.get('adult') || '2';

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {      
    const fetchHotels = async () => {
      if (!locationID) return;

      try {
        const apiUrl = `https://bookme.com.bd/admin/api/hotel/listing/${locationID}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [checkin, checkout, locationID, router]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:pt-28 bg-white text-blue-950">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:pt-28 bg-white text-blue-950">
      <div className="mb-8 md:mb-10 rounded-xl p-4 shadow-lg">
        <SearchBar
          initialValues={{
            checkin,
            checkout,
            locationID,
            rooms,
            adults: adult,
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className='hidden md:block md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit sticky top-28'>
          <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Refine Your Search</h3>
          <div className="space-y-4">
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Price Range</h4>
              <div className="h-1 bg-gray-200 rounded-full mb-2">
                <div className="h-1 bg-blue-600 rounded-full w-3/4"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>BDT 0</span>
                <span>BDT 10,000+</span>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Star Rating</h4>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-1">
                  <input type="checkbox" id={`star-${star}`} className="mr-2 accent-blue-600" />
                  <label htmlFor={`star-${star}`} className="text-sm text-gray-600 flex items-center">
                    {Array(star).fill().map((_, i) => (
                      <i key={i} className="fa-solid fa-star text-yellow-400 text-xs mr-0.5"></i>
                    ))}
                    {star < 5 && <span className="text-gray-400 ml-1">& up</span>}
                  </label>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
              {['Free WiFi', 'Swimming Pool', 'Restaurant', 'Air Conditioning', 'Parking'].map((amenity) => (
                <div key={amenity} className="flex items-center mb-1">
                  <input type="checkbox" id={`amenity-${amenity}`} className="mr-2 accent-blue-600" />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-600">{amenity}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotels List */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {hotels.length} {hotels.length === 1 ? 'Hotel' : 'Hotels'} Found
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Recommended</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Star Rating</option>
              </select>
            </div>
          </div>

          {hotels.length > 0 ? (
            <div className="space-y-5">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:border-blue-100"
                >
                  {/* Hotel Image */}
                  <div className="relative w-full md:w-2/5 h-52 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${hotel.img}`}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    {hotel.discount && (
                      <div className="absolute top-3 left-0 bg-[#FD7E14] text-white font-bold text-xs px-3 py-1 shadow-md z-10">
                        <span className="relative z-10">{hotel.discount}% OFF</span>
                        <div className="absolute right-0 top-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[20px] border-t-[#FD7E14] border-b-0 border-r-0 transform translate-x-full"></div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>

                  {/* Hotel Details */}
                  <div className="flex flex-col justify-between w-full md:w-3/5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl text-gray-800 mb-1">{hotel.name}</h3>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                          <i className="fa-solid fa-star text-yellow-400 text-sm mr-1"></i>
                          <span className="text-sm font-medium">{hotel.star} star</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <i className="fa-solid fa-location-dot text-xs mr-2"></i>
                        <span>{hotel.location}</span>
                      </div>

                      {/* Amenities */}
                      {hotel.summary?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.summary.slice(0, 6).map((amenity) => (
                            <span
                              key={amenity.id}
                              className="flex items-center text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                            >
                              <i className={`${amenity.icon_class} mr-2 text-blue-600 text-xs`}></i>
                              {amenity.name}
                            </span>
                          ))}
                          {hotel.summary.length > 6 && (
                            <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                              +{hotel.summary.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        {hotel.extra_discount_msg && (
                          <p className="text-xs text-green-600 font-medium mb-1">{hotel.extra_discount_msg}</p>
                        )}
                        <div className="flex items-end gap-2">
                          <p className="text-xl font-bold text-blue-800">BDT {hotel.price_after_discount}</p>
                          {hotel.discount && (
                            <p className="text-sm text-gray-500 line-through">BDT {hotel.regular_price}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">for 1 Night, per room</p>
                      </div>

                      <Link
                        href={`/hotel/list/details/${hotel.id}`}
                        style={{
                          background: "linear-gradient(90deg, #313881, #0678B4)",
                        }}
                        className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
                      >
                        View Details
                        <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-hotel text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hotels found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We could not find any hotels matching your criteria. Try adjusting your search filters or dates.
              </p>
              <Link
                href="/hotel"
                className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Modify Search
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelListPage;