'use client';

import { useState, useEffect, useRef } from 'react';
import SearchBar from '@/app/components/hotel/SearchBar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const HotelListPage = () => {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <HotelListContent />
    </Suspense>
  );
};

const HotelListContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const locationID = searchParams.get('locationID');
  const rooms = searchParams.get('rooms') || '1';
  const adult = searchParams.get('adult') || '2';

  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [sortOption, setSortOption] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchRef = useRef(null);
  const mobileFiltersRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationID) return;

      try {
        setLoading(true);
        // Fetch hotels
        const apiUrl = `https://bookme.com.bd/admin/api/hotel/listing/${locationID}`;
        const hotelRes = await fetch(apiUrl);

        if (!hotelRes.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const hotelData = await hotelRes.json();

        // Process all hotels
        const processedHotels = hotelData.map(hotel => {
          const price = hotel.price_after_discount || 0;
          const numericPrice = typeof price === 'string'
            ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0
            : price || 0;

          return {
            ...hotel,
            numericPrice,
            starNumber: parseInt(hotel.star) || 0,
            hasPrice: numericPrice > 0
          };
        });

        setHotels(processedHotels);

        // Calculate max price from hotels with prices
        const pricedHotels = processedHotels.filter(hotel => hotel.hasPrice);
        const calculatedMaxPrice = pricedHotels.length > 0
          ? Math.max(...pricedHotels.map(hotel => hotel.numericPrice))
          : 10000;

        setMaxPrice(Math.ceil(calculatedMaxPrice / 1000) * 1000);
        setPriceRange([0, Math.ceil(calculatedMaxPrice / 1000) * 1000]);

        // Fetch amenities
        const amenitiesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/aminities`);
        if (amenitiesRes.ok) {
          const amenitiesData = await amenitiesRes.json();
          setAmenities(amenitiesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationID]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      if (mobileFiltersRef.current && !mobileFiltersRef.current.contains(event.target)) {
        // Check if the click was on the filter button
        const filterButton = document.getElementById('mobile-filter-button');
        if (filterButton && !filterButton.contains(event.target)) {
          setShowMobileFilters(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleStarChange = (star) => {
    setSelectedStars(prev =>
      prev.includes(star)
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => [value, prev[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => [prev[0], value]);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const matchedHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(query)
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(matchedHotels);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (hotelName) => {
    setSearchQuery(hotelName);
    setShowSuggestions(false);
  };

  const resetAllFilters = () => {
    setSelectedAmenities([]);
    setSelectedStars([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Filter hotels based on selected filters
  const filteredHotels = hotels.filter(hotel => {
    const nameMatch = searchQuery === '' || 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase());

    const amenityMatch = selectedAmenities.length === 0 ||
      selectedAmenities.every(amenityId =>
        (hotel.summary?.some(amenity => amenity.id === amenityId)) ||
        (hotel.facilities?.some(facility => facility.id === amenityId))
      );

    const priceMatch = !hotel.hasPrice ||
      (hotel.numericPrice >= priceRange[0] &&
        hotel.numericPrice <= priceRange[1]);

    const starMatch = selectedStars.length === 0 ||
      selectedStars.includes(hotel.starNumber);

    return nameMatch && amenityMatch && priceMatch && starMatch;
  });

  // Enhanced sorting function
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    // Handle hotels without prices (always show them after priced hotels)
    if (!a.hasPrice && !b.hasPrice) return 0;
    if (!a.hasPrice) return 1;
    if (!b.hasPrice) return -1;

    switch (sortOption) {
      case 'price-low-high':
        return a.numericPrice - b.numericPrice;
      case 'price-high-low':
        return b.numericPrice - a.numericPrice;
      case 'star-rating':
        // Sort by star rating (descending), then by price (ascending)
        return b.starNumber - a.starNumber || a.numericPrice - b.numericPrice;
      default:
        // 'recommended' - keep original order
        return 0;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(price).replace('BDT', 'BDT ');
  };

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
    <div className="container mx-auto max-w-7xl lg:px-8 md:pt-24 bg-white text-blue-950">
      <div className="mb-8 md:mb-8 rounded-xl">
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

      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-20">
        <button
          id="mobile-filter-button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Filters</span>
          {(selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery) && (
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {selectedAmenities.length + selectedStars.length + (priceRange[1] < maxPrice ? 1 : 0) + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
          <div 
            ref={mobileFiltersRef}
            className="w-full max-w-sm bg-white h-full overflow-y-auto animate-slide-in"
          >
            <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center z-10">
              <h3 className="font-bold text-lg">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Hotel Name Search */}
              <div className="relative" ref={searchRef}>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Search by Hotel Name</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter hotel name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  )}
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => selectSuggestion(hotel.name)}
                      >
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min: {formatPrice(priceRange[0])}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={handleMinPriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max: {formatPrice(priceRange[1])}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={handleMaxPriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Star Rating</h4>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`mobile-star-${star}`}
                      className="mr-2 accent-blue-600"
                      checked={selectedStars.includes(star)}
                      onChange={() => handleStarChange(star)}
                    />
                    <label htmlFor={`mobile-star-${star}`} className="text-sm text-gray-600 flex items-center">
                      {Array(star).fill().map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-yellow-400 text-xs mr-0.5"></i>
                      ))}
                    </label>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
                <div className="max-h-60 overflow-y-auto pr-2">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`mobile-amenity-${amenity.id}`}
                        className="mr-2 accent-blue-600"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityChange(amenity.id)}
                      />
                      <label htmlFor={`mobile-amenity-${amenity.id}`} className="text-sm text-gray-600 flex items-center">
                        {amenity.icon_class && (
                          <i className={`${amenity.icon_class} mr-2 text-blue-600 text-xs`}></i>
                        )}
                        {amenity.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sticky bottom-0 bg-white border-t flex justify-between gap-3">
              <button
                onClick={resetAllFilters}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-blue-100 p-4 rounded-lg gap-6">
        {/* Filters Sidebar - Hidden on mobile */}
        <div className='hidden md:block md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit top-28'>
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">Refine Your Search</h3>
            {(selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery) && (
              <button
                onClick={resetAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset All
              </button>
            )}
          </div>
          
          {/* Hotel Name Search with Suggestions */}
          <div className="mb-6 relative" ref={searchRef}>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Search by Hotel Name</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter hotel name..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectSuggestion(hotel.name)}
                  >
                    {hotel.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min: {formatPrice(priceRange[0])}</label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max: {formatPrice(priceRange[1])}</label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Star Rating</h4>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`star-${star}`}
                    className="mr-2 accent-blue-600"
                    checked={selectedStars.includes(star)}
                    onChange={() => handleStarChange(star)}
                  />
                  <label htmlFor={`star-${star}`} className="text-sm text-gray-600 flex items-center">
                    {Array(star).fill().map((_, i) => (
                      <i key={i} className="fa-solid fa-star text-yellow-400 text-xs mr-0.5"></i>
                    ))}
                  </label>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Amenities</h4>
              <div className="max-h-60 overflow-y-auto pr-2">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.id}`}
                      className="mr-2 accent-blue-600"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityChange(amenity.id)}
                    />
                    <label htmlFor={`amenity-${amenity.id}`} className="text-sm text-gray-600 flex items-center">
                      {amenity.icon_class && (
                        <i className={`${amenity.icon_class} mr-2 text-blue-600 text-xs`}></i>
                      )}
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hotels List */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="price-high-low">Price (High to Low)</option>
                <option value="price-low-high">Price (Low to High)</option>
                <option value="star-rating">Star Rating</option>
              </select>
            </div>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="space-y-5">
              {sortedHotels.map((hotel) => (
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
                      priority={false}
                    />
                    {hotel.discount && hotel.discount > 0 && (
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
                      {(hotel.summary?.length > 0 || hotel.facilities?.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[...(hotel.summary || []), ...(hotel.facilities || [])]
                            .slice(0, 6)
                            .filter((item, index, self) =>
                              index === self.findIndex((t) => t.id === item.id)
                            )
                            .map((amenity) => {
                              const amenityData = amenities.find(a => a.id === amenity.id);
                              return (
                                <span
                                  key={amenity.id}
                                  className="flex items-center text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                >
                                  {amenityData?.icon_class && (
                                    <i className={`${amenityData.icon_class} mr-2 text-blue-600 text-xs`}></i>
                                  )}
                                  {amenityData?.name || amenity.name}
                                </span>
                              );
                            })}
                          {(hotel.summary?.length + hotel.facilities?.length) > 6 && (
                            <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                              +{(hotel.summary?.length || 0) + (hotel.facilities?.length || 0) - 6} more
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
                          {hotel.hasPrice ? (
                            <>
                              <p className="text-xl font-bold text-blue-800">
                                {formatPrice(hotel.price_after_discount)}
                              </p>
                              {hotel.discount && hotel.discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(hotel.regular_price)}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-blue-600">Contact for price</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">for 1 Night, per room</p>
                      </div>

                      <Link
                        href={`/hotel/list/details/${hotel.id}?checkin=${checkin}&checkout=${checkout}&rooms=${rooms}&adult=${adult}`}
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
                {selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery
                  ? "No hotels match your selected filters. Try adjusting your filters."
                  : "We could not find any hotels matching your criteria. Try adjusting your search filters or dates."}
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-4 inline-block px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-2"
              >
                Clear Filters
              </button>
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