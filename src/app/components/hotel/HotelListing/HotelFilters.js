'use client';

import { useRef } from 'react';

const HotelFilters = ({
  amenities,
  selectedAmenities,
  handleAmenityChange,
  selectedStars,
  handleStarChange,
  priceRange,
  handleMinPriceChange,
  handleMaxPriceChange,
  maxPrice,
  formatPrice,
  searchQuery,
  handleSearchChange,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  selectSuggestion,
  resetAllFilters,
  searchRef,
  isMobile = false,
  onCloseFilters = () => { }
}) => {
  const idPrefix = isMobile ? 'mobile-' : '';

  return (
    <div
      ref={searchRef}
      className={`${isMobile
        ? 'w-full mt-12 max-w-sm bg-white overflow-y-auto animate-slide-in z-40 h-[calc(100vh-100px)] fixed right-0 top-0 shadow-lg'
        : 'sticky top-16 h-[calc(100vh-64px)] overflow-y-auto w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 custom-scrollbar'
        }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center z-10">
          <h3 className="font-bold text-lg">Filters</h3>
          <button
            onClick={onCloseFilters}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={isMobile ? 'p-4 space-y-6' : 'space-y-6'}>
        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h3 className="font-bold text-lg text-blue-900">Refine Your Search</h3>
            {(selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery) && (
              <button
                onClick={resetAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset All
              </button>
            )}
          </div>
        )}

        {/* Hotel Name Search */}
        <div className="mb-6 relative">
          <h4 className="text-sm font-medium text-blue-950 mb-2">Search by Hotel Name</h4>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter hotel name..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              className="w-full px-4 py-2 text-sm border border-blue-800  rounded-md outline-none ring-2 ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  handleSearchChange({ target: { value: '' } });
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
              {suggestions.map(hotel => (
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
          <h4 className="text-sm font-medium text-blue-950 mb-3">Price Range</h4>
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

        {/* Star Ratings */}
        <div>
          <h4 className="text-sm font-medium text-blue-950 mb-2">Star Rating</h4>
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`${idPrefix}star-${star}`}
                className="mr-2 accent-blue-600"
                checked={selectedStars.includes(star)}
                onChange={() => handleStarChange(star)}
              />
              <label htmlFor={`${idPrefix}star-${star}`} className="text-sm text-gray-600 flex items-center">
                {Array.from({ length: star }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star text-yellow-400 text-xs mr-0.5"></i>
                ))}
              </label>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-medium text-blue-950 mb-2">Amenities</h4>
          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`${idPrefix}amenity-${amenity.id}`}
                  className="mr-2 accent-blue-600"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                />
                <label htmlFor={`${idPrefix}amenity-${amenity.id}`} className="text-sm text-gray-600 flex items-center">
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

      {/* Mobile Footer */}
      {isMobile && (
        <div className="p-4 sticky bottom-0 bg-white border-t flex justify-between gap-3">
          <button
            onClick={resetAllFilters}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onCloseFilters}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelFilters;
