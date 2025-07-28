'use client';

import { useState, useRef } from 'react';
import SearchBar from '@/app/components/hotel/HotelListingSearch/SearchBar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/utils/LoadingSpinner';
import HotelFilters from '@/app/components/hotel/HotelListing/HotelFilters';
import HotelCard from '@/app/components/hotel/HotelListing/HotelCard';

export default function HotelListClient({ 
  searchParams, 
  initialHotels = [], 
  initialAmenities = [],
  initialMaxPrice = 10000 
}) {
  const router = useRouter();
  const { checkin, checkout, locationID, rooms = '1', adult = '2' } = searchParams;

  const [hotels, setHotels] = useState(initialHotels);
  const [amenities, setAmenities] = useState(initialAmenities);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, initialMaxPrice]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [sortOption, setSortOption] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchRef = useRef(null);
  const mobileFiltersRef = useRef(null);

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
      ).slice(0, 5);
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
    if (!a.hasPrice && !b.hasPrice) return 0;
    if (!a.hasPrice) return 1;
    if (!b.hasPrice) return -1;

    switch (sortOption) {
      case 'price-low-high':
        return a.numericPrice - b.numericPrice;
      case 'price-high-low':
        return b.numericPrice - a.numericPrice;
      case 'star-rating':
        return b.starNumber - a.starNumber || a.numericPrice - b.numericPrice;
      default:
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

  return (
    <div className="container mx-auto max-w-7xl py-16 lg:px-8 md:pt-24 bg-white text-blue-950">
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
      <div className='bg-blue-100 p-5 rounded-lg'>
        {/* Mobile Filter Button */}
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
            <HotelFilters
              amenities={amenities}
              selectedAmenities={selectedAmenities}
              handleAmenityChange={handleAmenityChange}
              selectedStars={selectedStars}
              handleStarChange={handleStarChange}
              priceRange={priceRange}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              maxPrice={maxPrice}
              formatPrice={formatPrice}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              selectSuggestion={selectSuggestion}
              resetAllFilters={resetAllFilters}
              searchRef={mobileFiltersRef}
              isMobile={true}
              onCloseFilters={() => setShowMobileFilters(false)}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block md:w-1/4">
            <HotelFilters
              amenities={amenities}
              selectedAmenities={selectedAmenities}
              handleAmenityChange={handleAmenityChange}
              selectedStars={selectedStars}
              handleStarChange={handleStarChange}
              priceRange={priceRange}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              maxPrice={maxPrice}
              formatPrice={formatPrice}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              selectSuggestion={selectSuggestion}
              resetAllFilters={resetAllFilters}
              searchRef={searchRef}
            />
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
                  <option value="recommended">Recommended</option>
                  <option value="price-high-low">Price (High to Low)</option>
                  <option value="price-low-high">Price (Low to High)</option>
                  <option value="star-rating">Star Rating</option>
                </select>
              </div>
            </div>

            {filteredHotels.length > 0 ? (
              <div className="space-y-5">
                {sortedHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    amenities={amenities}
                    checkin={checkin}
                    checkout={checkout}
                    rooms={rooms}
                    adult={adult}
                  />
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
      <style jsx global>{`
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}