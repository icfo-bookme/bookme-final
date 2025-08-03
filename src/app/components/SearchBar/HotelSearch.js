"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";
import SearchButton from "../../../utils/SearchButton";
import DatePickerModal from "@/utils/DatePickerModal";
import GuestModal from "@/utils/GuestModal";
import { FaStar, FaMapMarkerAlt, FaSearch, FaMapMarker } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
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
    if (!query) return 0;

    const destName = destination?.name?.toLowerCase() || '';
    const destCountry = destination?.country?.toLowerCase() || '';
    const destFullText = `${destName}, ${destCountry}`.toLowerCase();
    const queryText = query.toLowerCase().trim();

    if (destFullText === queryText) return 1000;

    const destWords = destFullText.split(/[,\s]+/);
    const startsWithWord = destWords.some(word => word.startsWith(queryText));
    if (startsWithWord) return 800;

    const queryWords = queryText.split(/\s+/);
    const exactWordMatches = queryWords.filter(qw =>
      destWords.some(dw => dw === qw)
    ).length;
    if (exactWordMatches > 0) return 700 + (exactWordMatches * 50);

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

    if (substringMatches.length > 0) {
      const longestMatch = substringMatches.reduce((longest, current) =>
        current.length > longest.length ? current : longest
        , { length: 0 });

      const positionBonus = longestMatch.position === 0 ? 100 :
        (longestMatch.position < 5 ? 50 : 0);

      const lengthBonus = Math.pow(longestMatch.length, 2) * 5;

      const countBonus = Math.min(substringMatches.length * 15, 100);

      const isWordBoundary = destFullText[longestMatch.position - 1] === ' ' ||
        longestMatch.position === 0;
      const boundaryBonus = isWordBoundary ? 50 : 0;

      return 500 + positionBonus + lengthBonus + countBonus + boundaryBonus;
    }

    let sequenceScore = 0;
    let queryPos = 0;
    let consecutiveMatches = 0;
    let maxConsecutive = 0;

    for (let i = 0; i < queryText.length; i++) {
      const queryChar = queryText[i];
      const foundPos = destFullText.indexOf(queryChar, queryPos);

      if (foundPos !== -1) {
        if (foundPos === queryPos) {
          consecutiveMatches++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
          sequenceScore += 10;
        } else if (foundPos - queryPos <= 2) {
          sequenceScore += 5;
          consecutiveMatches = 1;
        } else {
          sequenceScore += 2;
          consecutiveMatches = 0;
        }
        queryPos = foundPos + 1;
      } else {
        consecutiveMatches = 0;
      }
    }

    const consecutiveBonus = maxConsecutive >= 3 ? maxConsecutive * 5 : 0;
    const normalizedSequenceScore = (sequenceScore / queryText.length) * 100 + consecutiveBonus;

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

    const phoneticScore = () => {
      if (queryText.length < 3) return 0;
      const firstCharMatch = queryText[0] === destFullText[0] ? 20 : 0;
      const vowelMatch = queryText.match(/[aeiou]/gi)?.length ===
        destFullText.match(/[aeiou]/gi)?.length ? 10 : 0;
      return firstCharMatch + vowelMatch;
    };

    return Math.min(
      normalizedSequenceScore + prefixBonus + phoneticScore(),
      900
    );
  };

  const highlightMatches = (text, query) => {
    if (!query || !text) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let lastIndex = 0;

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

    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return b.end - a.end;
    });

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

    for (const match of mergedMatches) {
      if (match.start > lastIndex) {
        result.push(text.substring(lastIndex, match.start));
      }
      result.push(
        <span key={match.start} className="font-bold text-blue-600">
          {text.substring(match.start, match.end)}
        </span>
      );
      lastIndex = match.end;
    }

    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result.length > 0 ? result : text;
  };

  const updateSuggestions = (query) => {
    if (!query) {
      const defaultSuggestions = destinations
        .map(dest => ({
          ...dest,
          score: 0,
          displayName: `${dest.name}, ${dest.country}`
        }));
      setSuggestions(defaultSuggestions);
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
    }).replace(",", "") || "";

  if (error) {
    return (
      <div className="bg-white max-w-5xl mx-auto pb-6 text-center">
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
    <div className=" max-w-5xl rounded-t-lg mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl shadow-sm">
          <div className="col-span-2 sm:col-span-1 space-y-1 relative" ref={searchRef}>
            <label className="block text-sm font-medium text-blue-950">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuMapPin className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="City, hotel, or area"
                className="pl-9 p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors w-full font-medium text-blue-950 text-base"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                  {suggestions.map((destination) => (
                    <div
                      key={destination.id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex justify-between items-center"
                      onClick={() => selectDestination(destination)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">
                          {highlightMatches(destination.name, searchQuery)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {highlightMatches(destination.country, searchQuery)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-blue-950">Check In</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors bg-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-blue-950">{formatDate(checkinDate)}</span>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-blue-950">Check Out</label>
            <div
              onClick={() => setShowDatePicker(true)}
              className="p-3 h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors bg-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-blue-950">{formatDate(checkoutDate)}</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1">
            <label className="block text-sm font-medium text-blue-950">Guests & Rooms</label>
            <div
              onClick={() => setShowGuestModal(true)}
              className="p-3 h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors bg-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium text-blue-950 ">{guestText}</span>
            </div>
          </div>
        </div>

        {showDatePicker && (
          <DatePickerModal
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            setShowDatePicker={setShowDatePicker}
            ref={datePickerRef}
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

        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Hotels</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default HotelSearch;