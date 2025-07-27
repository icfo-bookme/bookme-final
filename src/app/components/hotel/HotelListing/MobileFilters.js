'use client';

const MobileFilters = ({
  show,
  onClose,
  innerRef,
  searchRef,
  amenities,
  selectedAmenities,
  onAmenityChange,
  selectedStars,
  onStarChange,
  priceRange,
  maxPrice,
  onPriceChange,
  searchQuery,
  onSearchChange,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  onResetFilters,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(price).replace('BDT', 'BDT ');
  };

  if (!show) return null;

  return (
    <div className="md:hidden mt-12 fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end">
      <div 
        ref={innerRef}
        className="w-full max-w-sm bg-white h-full overflow-y-auto animate-slide-in"
      >
        <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center z-10">
          <h3 className="font-bold text-lg">Filters</h3>
          <button 
            onClick={onClose}
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
                onChange={onSearchChange}
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
                    onClick={() => onSelectSuggestion(hotel.name)}
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
                  onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
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
                  onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
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
                  onChange={() => onStarChange(star)}
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
            <div className="max-h-80 overflow-y-auto pr-2">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`mobile-amenity-${amenity.id}`}
                    className="mr-2 accent-blue-600"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => onAmenityChange(amenity.id)}
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
            onClick={onResetFilters}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;