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

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);

  const [destinations, setDestinations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialValues?.locationID || "");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkinDate, setCheckinDate] = useState(initialValues?.checkin ? new Date(initialValues.checkin) : today);
  const [checkoutDate, setCheckoutDate] = useState(initialValues?.checkout ? new Date(initialValues.checkout) : tomorrow);
  const [dateRange, setDateRange] = useState([checkinDate, checkoutDate]);

  const guestText = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}`;

  // Destination name finder
  const getDestinationNameById = (locationID) => {
    const destination = destinations.find(d => d.id === locationID);
    return destination ? `${destination.name}, ${destination.country}` : "Edit Search Information";
  };

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await getDestination();
        setDestinations(data);

        if (initialValues?.locationID) {
          const selected = data.find(d => String(d.id) === String(initialValues.locationID));
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

  // Advanced fuzzy matching with scoring
  const calculateMatchScore = (destination, query) => {
    const queryLower = query.toLowerCase();
    const fullText = `${destination.name}, ${destination.country}`.toLowerCase();
    
    // If query is empty, return lowest priority
    if (!queryLower) return 0;
    
    // Exact match at start gets highest score
    if (fullText.startsWith(queryLower)) return 100;
    
    // Exact match anywhere gets high score
    if (fullText.includes(queryLower)) return 90;
    
    // Calculate character matches (fuzzy matching)
    let qIndex = 0;
    let matchPositions = [];
    let totalMatches = 0;
    
    for (let i = 0; i < fullText.length && qIndex < queryLower.length; i++) {
      if (fullText[i] === queryLower[qIndex]) {
        matchPositions.push(i);
        qIndex++;
        totalMatches++;
      }
    }
    
    // No matches found
    if (totalMatches === 0) return 0;
    
    // Calculate score based on:
    // 1. Percentage of query characters matched
    const matchPercentage = (totalMatches / queryLower.length) * 50;
    
    // 2. How close the matches are (closer = better)
    const spread = matchPositions.length > 1 ? 
      matchPositions[matchPositions.length - 1] - matchPositions[0] : 0;
    const proximityScore = 50 / (spread + 1);
    
    // 3. Bonus for matches at word starts
    let wordStartBonus = 0;
    const words = fullText.split(/[\s,]+/);
    words.forEach(word => {
      if (word.startsWith(queryLower[0])) {
        wordStartBonus += 10;
      }
    });
    
    const totalScore = matchPercentage + proximityScore + wordStartBonus;
    return Math.min(100, Math.round(totalScore));
  };

  // Search handlers
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

  const updateSuggestions = (query) => {
    if (!query) {
      setSuggestions(destinations);
      return;
    }
    
    // Calculate scores for all destinations
    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query)
    }));

    // Filter and sort by score
    const matched = scoredDestinations
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    // Always show at least top 5 destinations, even with low scores
    setSuggestions(matched.length > 0 ? matched.slice(0, 10) : destinations.slice(0, 5));
  };

  const selectDestination = (destination) => {
    setSearchQuery(`${destination.name}, ${destination.country}`);
    setSelectedLocationId(destination.id);
    setSelectedDestination(destination);
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
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  // UI Loading/Error
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
        <div className="animate-pulse text-blue-950">Loading destinations...</div>
      </div>
    );
  }

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