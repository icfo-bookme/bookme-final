import React from "react";

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
  return (
    <form onSubmit={(e) => {
      handleSearch(e);
      setShowMobileSearch(false);
    }} className="w-full md:hidden p-4 bg-gray-200 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-950">Edit Search</h2>
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">CITY/HOTEL/RESORT/AREA</label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations..."
            className="p-3 h-8 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-0 transition-colors  w-full text-blue-950"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full  border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((destination) => (
                <div
                  key={destination.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => selectDestination(destination)}
                >
                  {destination.name}, {destination.country}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Check In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 h-8 border border-gray-300 rounded-lg flex items-center cursor-pointer"
            >
              <span className="text-blue-950">{formatMobileDate(checkinDate)}</span>
            </div>
          </div>

          {/* Check Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 h-8 border border-gray-300 rounded-lg flex items-center cursor-pointer"
            >
              <span className="text-blue-950">{formatMobileDate(checkoutDate)}</span>
            </div>
          </div>
        </div>
        {/* Guests & Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests & Rooms</label>
          <div
            onClick={() => setShowGuestModal(true)}
            className="p-3 h-8 border border-gray-300 rounded-lg  w-full flex items-center cursor-pointer"
          >
            <span className="text-blue-950">{guestText}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            className="flex-1 h-8 px-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-8 px-1 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileSearchForm;