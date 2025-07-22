"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchButton from "./SearchButton";

const HotelSearch = () => {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);

  const datePickerRef = useRef(null);
  const guestModalRef = useRef(null);
  const searchRef = useRef(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkinDate, setCheckinDate] = useState(today);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow);
  const [dateRange, setDateRange] = useState([today, tomorrow]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destinationsData = await getDestination();
        setDestinations(destinationsData);

        // Pre-fill input with first destination
        if (destinationsData.length > 0) {
          const first = destinationsData[0];
          setSearchQuery(`${first.name}, ${first.country}`);
          setSelectedLocationId(first.id);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, []);

  // Close dropdowns/modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (showGuestModal && guestModalRef.current && !guestModalRef.current.contains(event.target)) {
        setShowGuestModal(false);
      }
      if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker, showGuestModal, showSuggestions]);

  const guestText = `${adults} Adult${adults > 1 ? "s" : ""}, ${rooms} Room${rooms > 1 ? "s" : ""}`;

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
    setSelectedLocationId(""); // Clear selected location when typing
  };

const handleSearchFocus = () => {
  if (isFirstInputInteraction) {
    setIsFirstInputInteraction(false);

    // Clear input and show all suggestions
    setSearchQuery("");
    setSelectedLocationId("");
    setSuggestions(destinations); // show full list immediately
  } else {
    // show suggestions for current input
    updateSuggestions(searchQuery);
  }

  setShowSuggestions(true);
};


  const updateSuggestions = (query) => {
    const queryLower = query.toLowerCase();
    const matched = destinations.filter((dest) => {
      const fullName = `${dest.name} ${dest.country}`.toLowerCase();
      let qIndex = 0;
      for (let i = 0; i < fullName.length && qIndex < queryLower.length; i++) {
        if (fullName[i] === queryLower[qIndex]) qIndex++;
      }
      return qIndex === queryLower.length;
    });

    setSuggestions(query.length === 0 ? destinations : matched);
  };

  const selectDestination = (destination) => {
    setSearchQuery(`${destination.name}, ${destination.country}`);
    setSelectedLocationId(destination.id);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Please select a destination");
      return;
    }

    const query = new URLSearchParams({
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      child_ages: "",
      adult: String(adults),
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  const applyDateSelection = () => setShowDatePicker(false);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    }).replace(",", "");

  return (
    <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Destination Input */}
          <div className="col-span-2 md:col-span-1 space-y-1 relative" ref={searchRef}>
            <label className="block text-sm text-blue-950">City/Hotel/Resort/Area</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search destinations..."
              className="p-3 font-bold border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950 text-sm sm:text-base"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((destination) => (
                  <div
                    key={destination.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                    onClick={() => selectDestination(destination)}
                  >
                    {destination.name}, {destination.country}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div className="sm:col-span-1 space-y-1 relative">
            <label className="block text-sm text-blue-950">Check In</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white text-sm sm:text-base text-blue-950 font-bold"
            >
              {formatDate(checkinDate)}
            </div>
          </div>

          {/* Check-out Date */}
          <div className="sm:col-span-1 space-y-1 relative">
            <label className="block text-sm text-blue-950">Check Out</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white text-sm sm:text-base text-blue-950 font-bold"
            >
              {formatDate(checkoutDate)}
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="col-span-2 md:col-span-1 space-y-1">
            <label className="block text-sm font-medium text-blue-950">Guests & Rooms</label>
            <div
              onClick={() => setShowGuestModal(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white"
            >
              <div className="font-bold text-blue-950 text-sm sm:text-base">{guestText}</div>
            </div>
          </div>
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div ref={datePickerRef} className="bg-white rounded-lg p-4 shadow-lg mx-2 w-full max-w-[33rem]">
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateChange}
                minDate={new Date()}
                monthsShown={2}
                inline
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyDateSelection}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div ref={guestModalRef} className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-blue-950">Guests & Rooms</h2>
              {[["Adults", adults, setAdults, 1], ["Children", children, setChildren, 0], ["Rooms", rooms, setRooms, 1]].map(
                ([label, count, setter, min]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">{label}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setter(Math.max(count - 1, min))}
                        className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm sm:text-base">{count}</span>
                      <button
                        type="button"
                        onClick={() => setter(count + 1)}
                        className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Hotels</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default HotelSearch;
