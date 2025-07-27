'use client';

const HotelFilters = ({
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
  searchRef,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(price).replace('BDT', 'BDT ');
  };

  return (
    <div className="hidden lg:sticky lg:top-16 h-[calc(100vh)] mb-3 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-thumb-rounded md:block md:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h3 className="font-bold text-lg text-blue-950">Refine Your Search</h3>
        {(selectedAmenities.length > 0 || selectedStars.length > 0 || priceRange[1] < maxPrice || searchQuery) && (
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset All
          </button>
        )}
      </div>
      
      {/* Hotel Name Search */}
      <div className="mb-6 relative" ref={searchRef}>
        <h4 className="font-bold text-sm text-blue-900 mb-2">Search by Hotel Name</h4>
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

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-bold text-sm text-blue-950 mb-3">Price Range</h4>
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
          <h4 className="font-bold text-sm text-blue-950 mb-2">Star Rating</h4>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`star-${star}`}
                className="mr-2 accent-blue-600"
                checked={selectedStars.includes(star)}
                onChange={() => onStarChange(star)}
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
          <h4 className="font-bold text-sm text-blue-950 mb-2">Amenities</h4>
          <div className="max-h-60 overflow-y-auto pr-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  className="mr-2 accent-blue-600"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => onAmenityChange(amenity.id)}
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
  );
};

export default HotelFilters;