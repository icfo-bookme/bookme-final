"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";

import SearchButton from "../../../utils/SearchButton";
import DatePickerModal from "@/utils/DatePickerModal";
import GuestModal from "@/utils/GuestModal";

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

  const searchRef = useRef(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const guestText = `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}, ${rooms} Room${rooms > 1 ? "s" : ""}`;

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
      checkin: dateRange[0].toISOString().split("T")[0],
      checkout: dateRange[1] ? dateRange[1].toISOString().split("T")[0] : "",
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      child_ages: Array(children).fill(0).join(","),
      adult: String(adults),
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
  };

  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    }).replace(",", "") || "";

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
              {formatDate(dateRange[0])}
            </div>
          </div>

          {/* Check-out Date */}
          <div className="sm:col-span-1 space-y-1 relative">
            <label className="block text-sm text-blue-950">Check Out</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white text-sm sm:text-base text-blue-950 font-bold"
            >
              {formatDate(dateRange[1])}
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
        <div className="lg:w-9">
          {showDatePicker && (
            <DatePickerModal
              dateRange={dateRange}
              handleDateChange={handleDateChange}
              setShowDatePicker={setShowDatePicker}
            />
          )}
        </div>
        {/* Guest Modal */}
        {showGuestModal && (
          <GuestModal
            adults={adults}
            setAdults={setAdults}
            childrenNumber={children}
            setChildren={setChildren}
            rooms={rooms}
            setRooms={setRooms}
            setShowGuestModal={setShowGuestModal}
          />
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