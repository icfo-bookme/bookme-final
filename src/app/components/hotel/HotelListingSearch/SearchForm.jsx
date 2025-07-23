import React from "react";

const SearchForm = ({
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
  formatDate,
}) => {
  // ✅ Console here
  console.log("Select Destination Function:", searchQuery);

  // ✅ Default fallback formatDate
  const displayDate = formatDate || ((date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    }).replace(",", "")
  );

  return (
    <form onSubmit={handleSearch} className="w-full hidden md:block">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Destination Input */}
        <div className="w-full md:w-2/5 relative">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CITY/HOTEL/RESORT/AREA
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations..."
            className="p-3 h-14 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors bg-white w-full text-blue-950 text-lg"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((destination) => (
                <div
                  key={destination.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-lg"
                  onClick={() => selectDestination(destination)}
                >
                  {destination.name}, {destination.country}
                </div>
              ))}
            </div>
          )}
          {showSuggestions && suggestions.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-3 text-lg text-gray-500">
                No destinations found
              </div>
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
            className="p-3 h-14 border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
          >
            <span className="text-lg font-medium">{displayDate(checkinDate)}</span>
          </div>
        </div>

        {/* Check Out */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CHECK OUT
          </label>
          <div
            onClick={() => setShowDatePicker(true)}
            className="p-3 h-14 border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
          >
            <span className="text-lg font-medium">{displayDate(checkoutDate)}</span>
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            ROOMS & GUESTS
          </label>
          <div
            onClick={() => setShowGuestModal(true)}
            className="p-3 h-14 border border-gray-300 rounded-lg hover:border-blue-900 transition-colors bg-white w-full flex items-center cursor-pointer"
          >
            <span className="text-lg font-medium">{guestText}</span>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full mt-4 md:w-1/5">
          <button
            style={{
              background: "linear-gradient(90deg, #313881, #0678B4)",
            }}
            type="submit"
            className="w-full h-14 text-lg px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Modify Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
