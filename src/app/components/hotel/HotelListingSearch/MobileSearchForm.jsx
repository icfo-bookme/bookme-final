import React, { useRef, useEffect } from "react";

const MobileSearchForm = ({
  searchQuery,
  handleSearchChange,
  handleSearchFocus,
  showSuggestions,
  suggestions,
  selectDestination,
  checkinDate,
  checkoutDate,
  setShowDatePicker,
  guestText,
  setShowGuestModal,
  handleSearch,
  setShowMobileSearch,
  formatMobileDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}) => {
  const suggestionsRef = useRef(null);

  // Handle suggestion selection
  const handleSuggestionSelect = (destination, e) => {
    e.preventDefault();
    e.stopPropagation();
    selectDestination(destination);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        // This should be handled by your parent component's state
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(e);
        setShowMobileSearch(false);
      }} 
      className="w-full md:hidden p-4 bg-gray-200 rounded-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-950">Edit Search</h2>
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label htmlFor="mobile-destination-input" className="block text-sm font-medium text-gray-700 mb-1">
            CITY/HOTEL/RESORT/AREA
          </label>
          <input
            id="mobile-destination-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations..."
            className="p-3 h-12 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-0 transition-colors bg-white w-full text-blue-950"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 mt-1 w-full border bg-white border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  className="w-full text-left p-3 hover:bg-blue-50 active:bg-blue-100"
                  onClick={(e) => handleSuggestionSelect(destination, e)}
                  onTouchEnd={(e) => handleSuggestionSelect(destination, e)}
                >
                  {destination.name}, {destination.country}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Check In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full p-3 h-12 border border-gray-300 rounded-lg flex items-center justify-start text-blue-950 bg-white"
            >
              {formatMobileDate(checkinDate)}
            </button>
          </div>

          {/* Check Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full p-3 h-12 border border-gray-300 rounded-lg flex items-center justify-start text-blue-950 bg-white"
            >
              {formatMobileDate(checkoutDate)}
            </button>
          </div>
        </div>

        {/* Guests & Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests & Rooms</label>
          <button
            type="button"
            onClick={() => setShowGuestModal(true)}
            className="w-full p-3 h-12 border border-gray-300 rounded-lg flex items-center justify-start text-blue-950 bg-white"
          >
            {guestText}
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="flex-1 h-12 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-12 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileSearchForm;