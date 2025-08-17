import React, { useRef, useEffect } from "react";
import { LuMapPin } from "react-icons/lu";
import { FaCalendarAlt, FaUserFriends, FaHotel, FaStar } from "react-icons/fa";

const MobileForm = ({
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
  highlightMatches,
  formatDate,
}) => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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
    }).replace(",", "")
  );

  const handleItemClick = (item) => {
    selectDestination(item);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSearch} className="w-full hidden md:block">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Destination Input */}
        <div className="w-full md:w-2/5 relative" ref={dropdownRef}>
          <div className="absolute inset-y-0 left-0 pl-3 mt-5 flex items-center pointer-events-none">
            <LuMapPin className="h-5 w-5 text-blue-600" />
          </div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CITY/HOTEL/RESORT/AREA
          </label>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search destinations or hotels..."
            className="p-3 h-12 pl-10 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-base"
          />
          {showSuggestions && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-base"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">
                        {item.type === 'hotel' ? (
                          <FaHotel className="h-4 w-4 text-blue-500" />
                        ) : (
                          <LuMapPin className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="w-full">
                        <div className="font-bold">
                          {highlightMatches(item.name, searchQuery)}
                          {item.type === 'hotel' && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Hotel)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.type === 'hotel' 
                            ? `${highlightMatches(item.street_address, searchQuery)}`
                            : highlightMatches(item.country, searchQuery)}
                        </div>
                        {item.type === 'hotel' && (
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-3 h-3 ${i < item.starRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-base text-gray-500">
                  No results found
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
            className="p-3 h-12 font-bold text-base border border-gray-300 rounded-lg flex items-center gap-2 cursor-pointer hover:border-blue-900"
          >
            <FaCalendarAlt className="h-5 w-5 text-blue-600" />
            <span className="text-base font-bold">{displayDate(checkinDate)}</span>
          </div>
        </div>

        {/* Check Out */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            CHECK OUT
          </label>
          <div
            onClick={() => setShowDatePicker(true)}
            className="p-3 h-12 text-base font-bold border border-gray-300 rounded-lg flex items-center gap-2 cursor-pointer hover:border-blue-900"
          >
            <FaCalendarAlt className="h-5 w-5 text-blue-600" />
            <span className="text-base font-bold">{displayDate(checkoutDate)}</span>
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            ROOMS & GUESTS
          </label>
          <div
            onClick={() => setShowGuestModal(true)}
            className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 transition-colors bg-white w-full flex items-center gap-2 cursor-pointer"
          >
            <FaUserFriends className="h-5 w-5 text-blue-600" />
            <span className="text-base font-bold">{guestText}</span>
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
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default MobileForm;