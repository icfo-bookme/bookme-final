"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import getDestination from "@/services/hotel/getDestination";
import MobileSearchHeader from "./MobileSearchHeader";
import SearchForm from "./SearchForm";
import MobileSearchForm from "./MobileSearchForm";
import DatePickerModal from "../../../../utils/DatePickerModal";
import GuestModal from "../../../../utils/GuestModal";

const SearchBar = ({ initialValues }) => {
  const router = useRouter();

  // Modal states
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Guest counts
  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(initialValues?.children || 0);
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);

  // Destinations & selection
  const [destinations, setDestinations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialValues?.locationID || "");
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Search input and suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date handling
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkinDate, setCheckinDate] = useState(
    initialValues?.checkin ? new Date(initialValues.checkin) : today
  );
  const [checkoutDate, setCheckoutDate] = useState(
    initialValues?.checkout ? new Date(initialValues.checkout) : tomorrow
  );
  const [dateRange, setDateRange] = useState([checkinDate, checkoutDate]);

  // Guest summary text
  const guestText = `${rooms} Room${rooms > 1 ? "s" : ""}, ${adults} Adult${adults > 1 ? "s" : ""}${
    children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""
  }`;

  // Get destination display name by id
  const getDestinationNameById = (locationID) => {
    const destination = destinations.find((d) => d.id === locationID);
    return destination ? `${destination.name}, ${destination.country}` : "Edit Search Information";
  };

  // Load destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await getDestination();
        setDestinations(data);

        if (initialValues?.locationID) {
          const selected = data.find((d) => String(d.id) === String(initialValues.locationID));
          if (selected) {
            setSelectedDestination(selected);
            setSearchQuery(`${selected.name}, ${selected.country}`);
            setSelectedLocationId(selected.id);
          }
        }
      } catch (error) {
        console.error("Failed to load destinations:", error);
        setError("Failed to load destinations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [initialValues?.locationID]);

 
  const calculateMatchScore = (destination, query) => {
    if (!query) return 0;

    const queryLower = query.toLowerCase();
    const fullText = `${destination.name}, ${destination.country}`.toLowerCase();

    let matchCount = 0;
    const fullTextChars = fullText.split("");
    const usedIndices = new Set();

    // Count how many characters of query appear anywhere in fullText (ignoring order)
    for (const char of queryLower) {
      // Find first unused matching character
      const index = fullTextChars.findIndex(
        (c, i) => c === char && !usedIndices.has(i)
      );
      if (index !== -1) {
        matchCount++;
        usedIndices.add(index);
      }
    }

    if (matchCount === 0) return 0;

    // Calculate base score by match percentage of query characters found
    const matchPercentage = (matchCount / queryLower.length) * 70;

    // Penalize by length difference between query and fullText (the smaller the better)
    const lengthDifference = Math.abs(fullText.length - queryLower.length);
    const lengthPenalty = Math.min(30, lengthDifference * 2); // max 30 penalty

    // Final score
    const score = matchPercentage - lengthPenalty;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Highlight matched letters in suggestion text
  const highlightMatches = (text, query) => {
    if (!query) return text;

    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    let result = [];
    let queryIndex = 0;

    for (let i = 0; i < text.length; i++) {
      if (
        queryIndex < query.length &&
        textLower[i] === queryLower[queryIndex]
      ) {
        result.push(
          <mark key={i} className="bg-yellow-300">
            {text[i]}
          </mark>
        );
        queryIndex++;
      } else {
        result.push(text[i]);
      }
    }
    return result;
  };

  // Update suggestions based on query using the new scoring method
  const updateSuggestions = (query) => {
    if (!query) {
      setSuggestions(destinations.slice(0, 5));
      return;
    }

    const scored = destinations
      .map((dest) => ({
        ...dest,
        score: calculateMatchScore(dest, query),
      }))
      .filter((dest) => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    setSuggestions(scored.length > 0 ? scored.slice(0, 10) : destinations.slice(0, 5));
  };

  // Input change handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);

    if (!query) {
      setSelectedLocationId("");
      setSelectedDestination(null);
    }
  };

  // On input focus
  const handleSearchFocus = () => {
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedLocationId("");
      setSelectedDestination(null);
      setSuggestions(destinations.slice(0, 5));
    } else {
      updateSuggestions(searchQuery);
    }
    setShowSuggestions(true);
  };

  // When user picks a suggestion
  const selectDestination = (destination) => {
    setSearchQuery(`${destination.name}, ${destination.country}`);
    setSelectedLocationId(destination.id);
    setSelectedDestination(destination);
    setShowSuggestions(false);
  };

  // Submit handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (!selectedLocationId) {
      alert("Please select a valid destination");
      return;
    }

    const queryParams = new URLSearchParams({
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      adult: String(adults),
      children: String(children),
    }).toString();

    router.push(`/hotel/list?${queryParams}`);
  };

  // Date change from modal
  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
        <div className="animate-pulse text-blue-950">Loading destinations...</div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
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
    <div className="bg-white rounded-xl max-w-7xl mx-auto">
      {!showMobileSearch && (
        <MobileSearchHeader
          selectedLocationId={selectedLocationId}
          checkinDate={checkinDate}
          checkoutDate={checkoutDate}
          guestText={guestText}
          getDestinationNameById={getDestinationNameById}
          setShowMobileSearch={setShowMobileSearch}
        />
      )}

      <SearchForm
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchFocus={handleSearchFocus}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        selectDestination={selectDestination}
        checkinDate={checkinDate}
        checkoutDate={checkoutDate}
        setShowDatePicker={setShowDatePicker}
        guestText={guestText}
        setShowGuestModal={setShowGuestModal}
        handleSearch={handleSearch}
        setShowSuggestions={setShowSuggestions}
        highlightMatches={highlightMatches}
      />

      {showMobileSearch && (
        <MobileSearchForm
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          handleSearchFocus={handleSearchFocus}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          selectDestination={selectDestination}
          checkinDate={checkinDate}
          checkoutDate={checkoutDate}
          setShowDatePicker={setShowDatePicker}
          guestText={guestText}
          setShowGuestModal={setShowGuestModal}
          handleSearch={handleSearch}
          setShowMobileSearch={setShowMobileSearch}
          highlightMatches={highlightMatches}
        />
      )}

      {showDatePicker && (
        <DatePickerModal
          dateRange={dateRange}
          handleDateChange={handleDateChange}
          setShowDatePicker={setShowDatePicker}
        />
      )}

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
    </div>
  );
};

export default SearchBar;
