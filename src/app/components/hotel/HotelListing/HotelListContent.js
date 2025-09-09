'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/app/components/hotel/HotelListingSearch/SearchBar';
import HotelFilters from './HotelFilters';
import MobileFilters from './MobileFilters';
import HotelCard from './HotelCard';
import HotelSortControls from './HotelSortControls';
import NoResults from './NoResults';
import LoadingSpinner from '@/utils/LoadingSpinner';

const HotelListContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract search params...
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const locationID = searchParams.get('locationID');
  const rooms = searchParams.get('rooms') || '1';
  const adult = searchParams.get('adult') || '2';

  // State management...
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


  if (loading) {
    return <LoadingSpinner />;
  }

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
      <MobileFilters
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        innerRef={mobileFiltersRef}
        searchRef={searchRef}
        amenities={amenities}
        selectedAmenities={selectedAmenities}
        onAmenityChange={handleAmenityChange}
        selectedStars={selectedStars}
        onStarChange={handleStarChange}
        priceRange={priceRange}
        maxPrice={maxPrice}
        onPriceChange={setPriceRange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSelectSuggestion={selectSuggestion}
        onResetFilters={resetAllFilters}
      />

      <div className="flex sticky flex-col md:flex-row bg-blue-100 p-4 rounded-lg gap-6">
        {/* Desktop Filters */}
        <HotelFilters
          amenities={amenities}
          selectedAmenities={selectedAmenities}
          onAmenityChange={handleAmenityChange}
          selectedStars={selectedStars}
          onStarChange={handleStarChange}
          priceRange={priceRange}
          maxPrice={maxPrice}
          onPriceChange={setPriceRange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSelectSuggestion={selectSuggestion}
          onResetFilters={resetAllFilters}
          searchRef={searchRef}
        />

        {/* Hotels List */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
            </h2>
            <HotelSortControls 
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
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
            <NoResults 
              hasFilters={selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery}
              onResetFilters={resetAllFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelListContent;