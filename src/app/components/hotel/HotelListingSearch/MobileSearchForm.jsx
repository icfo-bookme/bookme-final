import React, { useRef, useEffect } from "react";

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

  // Handle suggestion selection
  const handleSuggestionSelect = (destination, e) => {
    e.preventDefault();
    e.stopPropagation();
    selectDestination(destination);

    // Update local state to ensure consistency
    if (destination.type === 'hotel') {
      setSelectedHotelId(destination.id);
      setSelectedLocationId(destination.destinationId || "");
      setSelectedDestination({
        id: destination.destinationId || "",
        name: destination.city,
        country: destination.country
      });
      setSearchQuery(`${destination.name}, ${destination.city}, ${destination.country}`);
    } else {
      setSelectedLocationId(destination.id);
      setSelectedHotelId("");
      setSelectedDestination(destination);
      setSearchQuery(`${destination.name}, ${destination.country}`);
    }

    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [setShowSuggestions]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(e);
        setShowMobileSearch(false);
      }}
      className="md:hidden mx-auto p-4 w-[95%] border border-gray-200 rounded-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-950">Edit Search</h2>
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="text-gray-500 hover:text-gray-700"
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
            id="mobile-destination-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations..."
            className="p-3 h-8 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-0 bg-white w-full text-blue-950"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-1 w-full border bg-white border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((destination) => (
                <button
                  key={`${destination.type}-${destination.id}`}
                  type="button"
                  className="w-full text-left p-3 hover:bg-blue-50 active:bg-blue-100 text-gray-800"
                  onClick={(e) => handleSuggestionSelect(destination, e)}
                  onTouchEnd={(e) => handleSuggestionSelect(destination, e)}
                >
                  <div className="font-medium">
                    {highlightMatches(destination.name, searchQuery)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {destination.type === 'hotel'
                      ? highlightMatches(`${destination.city}, ${destination.country}`, searchQuery)
                      : highlightMatches(destination.country, searchQuery)}
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
              onClick={() => setShowDatePicker(true)}
              className="w-full p-3 h-8 border border-gray-300 rounded-lg flex items-center text-blue-950 bg-white"
            >
              {formatDate(checkinDate)}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Out
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full p-3 h-8 border border-gray-300 rounded-lg flex items-center text-blue-950 bg-white"
            >
              {formatDate(checkoutDate)}
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
            onClick={() => setShowGuestModal(true)}
            className="w-full p-3 h-8 border border-gray-300 rounded-lg flex items-center text-blue-950 bg-white"
          >
            {guestText}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="flex-1 h-8 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-8 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileSearchForm;