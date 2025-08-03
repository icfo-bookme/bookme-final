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

  // Enhanced matching algorithm with multiple scoring factors
  const calculateMatchScore = (destination, query) => {
    if (!query || !destination?.name || !destination?.country) return 0;
    
    const destName = destination.name.toLowerCase();
    const destCountry = destination.country.toLowerCase();
    const destFullText = `${destName}, ${destCountry}`;
    const queryText = query.toLowerCase().trim();
    
    // Exact match bonus (highest priority)
    if (destFullText === queryText) return 1000;
    
    // Check if query is at the start of any word in the destination
    const destWords = destFullText.split(/[,\s]+/);
    const startsWithWord = destWords.some(word => word.startsWith(queryText));
    if (startsWithWord) return 800;
    
    // Check for exact word matches
    const queryWords = queryText.split(/\s+/);
    const exactWordMatches = queryWords.filter(qw => 
      destWords.some(dw => dw === qw)
    ).length;
    if (exactWordMatches > 0) return 700 + (exactWordMatches * 50);
    
    // Find all substring matches (minimum length 2)
    const substringMatches = [];
    for (let i = 0; i <= queryText.length - 2; i++) {
      for (let j = i + 2; j <= queryText.length; j++) {
        const substring = queryText.substring(i, j);
        const regex = new RegExp(substring, 'gi');
        let match;
        while ((match = regex.exec(destFullText)) !== null) {
          substringMatches.push({
            substring,
            position: match.index,
            length: substring.length
          });
        }
      }
    }
    
    // Calculate substring score if we have matches
    if (substringMatches.length > 0) {
      // Find the longest substring match
      const longestMatch = substringMatches.reduce((longest, current) => 
        current.length > longest.length ? current : longest
      , { length: 0 });
      
      // Position bonus - matches at start score higher
      const positionBonus = longestMatch.position === 0 ? 100 : 
                          (longestMatch.position < 5 ? 50 : 0);
      
      // Length bonus - longer matches score higher (quadratic scaling)
      const lengthBonus = Math.pow(longestMatch.length, 2) * 5;
      
      // Count of matches bonus (diminishing returns)
      const countBonus = Math.min(substringMatches.length * 15, 100);
      
      // Word boundary bonus - matches at word starts score higher
      const isWordBoundary = destFullText[longestMatch.position - 1] === ' ' || 
                            longestMatch.position === 0;
      const boundaryBonus = isWordBoundary ? 50 : 0;
      
      // Total substring score
      return 500 + positionBonus + lengthBonus + countBonus + boundaryBonus;
    }
    
    // Character sequence matching with adjacency bonus
    let sequenceScore = 0;
    let queryPos = 0;
    let consecutiveMatches = 0;
    let maxConsecutive = 0;
    
    for (let i = 0; i < queryText.length; i++) {
      const queryChar = queryText[i];
      const foundPos = destFullText.indexOf(queryChar, queryPos);
      
      if (foundPos !== -1) {
        // Bonus for consecutive characters
        if (foundPos === queryPos) {
          consecutiveMatches++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
          sequenceScore += 10; // Adjacent match bonus
        } else if (foundPos - queryPos <= 2) {
          sequenceScore += 5; // Nearby match bonus
          consecutiveMatches = 1;
        } else {
          sequenceScore += 2; // Basic match
          consecutiveMatches = 0;
        }
        queryPos = foundPos + 1;
      } else {
        consecutiveMatches = 0;
      }
    }
    
    // Consecutive character bonus
    const consecutiveBonus = maxConsecutive >= 3 ? maxConsecutive * 5 : 0;
    
    // Normalize sequence score with bonuses
    const normalizedSequenceScore = (sequenceScore / queryText.length) * 100 + consecutiveBonus;
    
    // Common prefix matching
    const commonPrefixLength = () => {
      let i = 0;
      while (i < queryText.length && i < destFullText.length && 
             queryText[i] === destFullText[i]) {
        i++;
      }
      return i;
    };
    
    const prefixLength = commonPrefixLength();
    const prefixBonus = prefixLength >= 3 ? prefixLength * 10 : 0;
    
    // Phonetic similarity (very basic)
    const phoneticScore = () => {
      if (queryText.length < 3) return 0;
      const firstCharMatch = queryText[0] === destFullText[0] ? 20 : 0;
      const vowelMatch = queryText.match(/[aeiou]/gi)?.length === 
                        destFullText.match(/[aeiou]/gi)?.length ? 10 : 0;
      return firstCharMatch + vowelMatch;
    };
    
    // Combine all scores
    return Math.min(
      normalizedSequenceScore + prefixBonus + phoneticScore(),
      900 // Cap at 900 to leave room for higher priority matches
    );
  };

  // Enhanced highlighting function
  const highlightMatches = (text, query) => {
    if (!query || !text) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let lastIndex = 0;

    // Find all possible substring matches (minimum length 2)
    const matches = [];
    for (let i = 0; i <= lowerQuery.length - 2; i++) {
      for (let j = i + 2; j <= lowerQuery.length; j++) {
        const substring = lowerQuery.substring(i, j);
        let pos = lowerText.indexOf(substring);
        while (pos !== -1) {
          matches.push({ start: pos, end: pos + substring.length });
          pos = lowerText.indexOf(substring, pos + 1);
        }
      }
    }

    // Sort matches by start position, then by length (longest first)
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - a.end;
    });

    // Merge overlapping matches, keeping the longest ones
    const mergedMatches = [];
    if (matches.length > 0) {
      let current = matches[0];
      for (let i = 1; i < matches.length; i++) {
        if (matches[i].start <= current.end) {
          if (matches[i].end > current.end) {
            current.end = matches[i].end;
          }
        } else {
          mergedMatches.push(current);
          current = matches[i];
        }
      }
      mergedMatches.push(current);
    }

    // Build the highlighted text
    for (const match of mergedMatches) {
      // Add text before match
      if (match.start > lastIndex) {
        result.push(text.substring(lastIndex, match.start));
      }
      // Add matched text
      result.push(
        <span key={match.start} className="font-bold text-blue-600">
          {text.substring(match.start, match.end)}
        </span>
      );
      lastIndex = match.end;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result.length > 0 ? result : text;
  };

  // Update suggestions based on query
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
      .filter(dest => dest.score > 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aPos = a.displayName.toLowerCase().indexOf(query.toLowerCase());
        const bPos = b.displayName.toLowerCase().indexOf(query.toLowerCase());
        if (aPos !== bPos) return aPos - bPos;
        if (a.displayName.length !== b.displayName.length) {
          return a.displayName.length - b.displayName.length;
        }
        return a.displayName.localeCompare(b.displayName);
      })
    ;

    setSuggestions(sorted.length > 0 ? sorted : destinations);
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
      setSuggestions(destinations);
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

  // Format date for display
  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).replace(",", "") || "";

  // Loading UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
        <div className="animate-pulse flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-950">Loading destinations...</span>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
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
        formatDate={formatDate}
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
          formatDate={formatDate}
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