import React, { useRef, useEffect } from "react";

const SearchForm = ({
  searchQuery,
  handleSearchChange,
  handleSearchFocus,
  showSuggestions,
  setShowSuggestions, // Add this prop
  suggestions,
  selectDestination,
  checkinDate,
  checkoutDate,
  setShowDatePicker,
  guestText,
  setShowGuestModal,
  handleSearch,
  formatDate,
}) => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  const displayDate = formatDate || ((date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    }).replace(",", "")
  );

  const handleDestinationClick = (destination) => {
    selectDestination(destination);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSearch} className="w-full hidden md:block">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Destination Input */}
        <div className="w-full md:w-2/5 relative" ref={dropdownRef}>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CITY/HOTEL/RESORT/AREA
          </label>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations..."
            className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg"
          />
          {showSuggestions && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.length > 0 ? (
                suggestions.map((destination) => (
                  <div
                    key={destination.id}
                    className="p-3 hover:bg-blue-50 font-bold cursor-pointer text-lg"
                    onClick={() => handleDestinationClick(destination)}
                  >
                    {destination.name}, {destination.country}
                  </div>
                ))
              ) : (
                <div className="p-3 text-lg text-gray-500">
                  No destinations found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check In */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CHECK IN
          </label>
          <div
            onClick={() => setShowDatePicker(true)}
            className="p-3 h-12 font-bold border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
          >
            <span className="text-lg font-bold">{displayDate(checkinDate)}</span>
          </div>
        </div>

        {/* Check Out */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CHECK OUT
          </label>
          <div
            onClick={() => setShowDatePicker(true)}
            className="p-3 h-12 font-bold border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
          >
            <span className="text-lg font-bold">{displayDate(checkoutDate)}</span>
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            ROOMS & GUESTS
          </label>
          <div
            onClick={() => setShowGuestModal(true)}
            className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 transition-colors bg-white w-full flex items-center cursor-pointer"
          >
            <span className="text-lg font-bold">{guestText}</span>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full mt-4 md:w-1/5">
          <button
            style={{
              background: "linear-gradient(90deg, #313881, #0678B4)",
            }}
            type="submit"
            className="w-full h-12 text-lg px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Modify Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;