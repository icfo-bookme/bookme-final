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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRef = useRef(null);
  const datePickerRef = useRef(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState([today, tomorrow]);
  const [checkinDate, setCheckinDate] = useState(today);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const destinationsData = await getDestination();
        setDestinations(destinationsData);

        if (destinationsData.length > 0) {
          const first = destinationsData[0];
          setSearchQuery(`${first.name}, ${first.country}`);
          setSelectedLocationId(first.id);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load destinations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  const guestText = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;

  const calculateMatchScore = (destination, query) => {
    const queryLower = query.toLowerCase();
    const fullText = `${destination.name}, ${destination.country}`.toLowerCase();

    if (!queryLower) return 0;

    let matchCount = 0;
    for (let i = 0; i < queryLower.length; i++) {
      if (fullText.includes(queryLower[i])) {
        matchCount++;
      }
    }

    return Math.round((matchCount / queryLower.length) * 100);
  };

  const highlightMatches = (text, query) => {
    if (!query) return text;

    const queryChars = new Set(query.toLowerCase());
    return text.split("").map((char, idx) =>
      queryChars.has(char.toLowerCase()) ? (
        <span key={idx} className="font-bold text-blue-600">
          {char}
        </span>
      ) : (
        char
      )
    );
  };

  const updateSuggestions = (query) => {
    if (!query) {
      setSuggestions(destinations);
      return;
    }

    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query),
      displayName: `${dest.name}, ${dest.country}`
    }));

    const sorted = scoredDestinations
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

     setSuggestions(sorted);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
    if (!query) setSelectedLocationId("");
  };

  const handleSearchFocus = () => {
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedLocationId("");
      setSuggestions(destinations);
    } else {
      updateSuggestions(searchQuery);
    }
    setShowSuggestions(true);
  };

  const selectDestination = (destination) => {
    setSearchQuery(`${destination.name}, ${destination.country}`);
    setSelectedLocationId(destination.id);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Please select a valid destination");
      return;
    }

    const query = new URLSearchParams({
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      adult: String(adults),
      child_ages: Array(children).fill(0).join(","),
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
    }).replace(",", "") || "";

  if (isLoading) {
    return (
      <div className="bg-white max-w-5xl mx-auto pb-6 text-center">
        <div className="animate-pulse text-blue-950">Loading destinations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white max-w-5xl mx-auto pb-6 text-center">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-1 space-y-1 relative" ref={searchRef}>
            <label className="block text-sm text-blue-950">City/Hotel/Resort/Area</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder={isFirstInputInteraction ? "" : "Search destinations..."}
              className="p-3 font-bold border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950 text-sm sm:text-base"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center"
                    onClick={() => selectDestination(destination)}
                  >
                    <div>
                      {highlightMatches(destination.name, searchQuery)},{" "}
                      {highlightMatches(destination.country, searchQuery)}
                    </div>
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                        Best match
                      </span>
                    )}
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
          <DatePickerModal
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            setShowDatePicker={setShowDatePicker}
            ref={datePickerRef}
          />
        )}

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
