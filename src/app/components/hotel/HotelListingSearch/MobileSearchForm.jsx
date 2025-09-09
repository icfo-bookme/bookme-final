import React, { useRef, useEffect, useState } from "react";

const MobileSearchForm = ({
  searchQuery,
  handleSearchChange,
  handleSearchFocus,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  selectDestination,
  checkinDate,
  checkoutDate,
  setShowDatePicker,
  guestText,
  setShowGuestModal,
  handleSearch,
  setShowMobileSearch,
  setSearchQuery,
  setSelectedHotelId,
  setSelectedLocationId,
  setSelectedDestination,
  updateSuggestions,
  highlightMatches,
  formatDate = (date) =>
    date?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) || ""
}) => {
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const isSelectingRef = useRef(false);
  const [inputClicked, setInputClicked] = useState(false);

  const handleInputFocus = (e) => {
    setInputClicked(true);
    if (handleSearchFocus) {
      handleSearchFocus(e);
    }
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (destination, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    isSelectingRef.current = true;
    
    if (selectDestination) {
      selectDestination(destination);
    }

    if (destination.type === 'hotel') {
      if (setSelectedHotelId) setSelectedHotelId(destination.id);
      if (setSelectedLocationId) setSelectedLocationId(destination.destinationId || "");
      if (setSelectedDestination) setSelectedDestination({
        id: destination.destinationId || "",
        name: destination.city,
        country: destination.country
      });
      if (setSearchQuery) setSearchQuery(`${destination.name}, ${destination.city}, ${destination.country}`);
    } else {
      if (setSelectedLocationId) setSelectedLocationId(destination.id);
      if (setSelectedHotelId) setSelectedHotelId("");
      if (setSelectedDestination) setSelectedDestination(destination);
      if (setSearchQuery) setSearchQuery(`${destination.name}, ${destination.country}`);
    }

    if (setShowSuggestions) setShowSuggestions(false);
    setInputClicked(false);
    
    // Reset flag after a short delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if we're in the process of selecting a suggestion
      if (isSelectingRef.current) return;
      
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        if (setShowSuggestions) setShowSuggestions(false);
        setInputClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [setShowSuggestions]);

  // Always show suggestions when input is focused and has content
  useEffect(() => {
    if (inputClicked && searchQuery && setShowSuggestions) {
      setShowSuggestions(true);
    }
  }, [inputClicked, searchQuery, setShowSuggestions]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (handleSearch) handleSearch(e);
        if (setShowMobileSearch) setShowMobileSearch(false);
      }}
      className="md:hidden mx-auto p-4 w-[95%] border border-gray-200 rounded-lg bg-white shadow-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-950">Edit Search</h2>
          <button
            type="button"
            onClick={() => setShowMobileSearch && setShowMobileSearch(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label
            htmlFor="mobile-destination-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CITY/HOTEL/RESORT/AREA
          </label>
          <input
            ref={inputRef}
            id="mobile-destination-input"
            type="text"
            value={searchQuery || ""}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onClick={handleInputFocus}
            placeholder="Search destinations..."
            className="p-3 h-10 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-white w-full text-blue-950"
          />
          {(showSuggestions || inputClicked) && suggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-1 w-full border bg-white border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((destination) => (
                <button
                  key={`${destination.type}-${destination.id}`}
                  type="button"
                  className="w-full text-left p-3 hover:bg-blue-50 active:bg-blue-100 text-gray-800 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => handleSuggestionSelect(destination, e)}
                  onTouchEnd={(e) => handleSuggestionSelect(destination, e)}
                >
                  <div className="font-medium">
                    {highlightMatches ? highlightMatches(destination.name, searchQuery) : destination.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {destination.type === 'hotel'
                      ? (highlightMatches ? highlightMatches(`${destination.city}, ${destination.country}`, searchQuery) : `${destination.city}, ${destination.country}`)
                      : (highlightMatches ? highlightMatches(destination.country, searchQuery) : destination.country)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check In
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker && setShowDatePicker(true)}
              className="w-full p-3 h-10 border border-gray-300 rounded-lg flex items-center justify-between text-blue-950 bg-white"
            >
              <span>{formatDate(checkinDate) || "Select date"}</span>
              <span className="text-gray-400">📅</span>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Out
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker && setShowDatePicker(true)}
              className="w-full p-3 h-10 border border-gray-300 rounded-lg flex items-center justify-between text-blue-950 bg-white"
            >
              <span>{formatDate(checkoutDate) || "Select date"}</span>
              <span className="text-gray-400">📅</span>
            </button>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests & Rooms
          </label>
          <button
            type="button"
            onClick={() => setShowGuestModal && setShowGuestModal(true)}
            className="w-full p-3 h-10 border border-gray-300 rounded-lg flex items-center justify-between text-blue-950 bg-white"
          >
            <span>{guestText || "Select guests"}</span>
            <span className="text-gray-400">👥</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowMobileSearch && setShowMobileSearch(false)}
            className="flex-1 h-10 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-10 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileSearchForm;