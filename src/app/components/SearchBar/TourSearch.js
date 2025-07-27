"use client";

import { useEffect, useState, useRef } from "react";
import SearchButton from "../../../utils/SearchButton";
import getTourDestination from "@/services/getTourDestination";
import { useRouter } from "next/navigation";

const TourSearch = () => {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await getTourDestination();

        if (response?.success) {
          const visibleDestinations = response.data.filter(
            (dest) => dest.isShow === "yes"
          );
          setDestinations(visibleDestinations);

          if (visibleDestinations.length > 0) {
            const first = visibleDestinations[0];
            setSearchQuery(`${first.name}, ${first.country}`);
            setSelectedLocationId(first.id);
          }
        }
      } catch (error) {
        setError("Failed to load destinations");
        console.error("Error loading destinations:", error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Please select a valid destination");
      return;
    }
    router.push(`/tour/${selectedLocationId}`);
  };

  // Enhanced fuzzy matching with scoring
  const calculateMatchScore = (destination, query) => {
    const queryLower = query.toLowerCase();
    const fullText = `${destination.name}, ${destination.country}`.toLowerCase();
    
    if (!queryLower) return 0;
    
    // Exact match at start gets highest score
    if (fullText.startsWith(queryLower)) return 100;
    
    // Exact match anywhere gets high score
    if (fullText.includes(queryLower)) return 90;
    
    // Fuzzy matching
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

    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query)
    }));

    // Filter and sort by score
    const matched = scoredDestinations
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    // Always show at least top 5 destinations if no matches
    setSuggestions(matched.length > 0 ? matched.slice(0, 10) : destinations.slice(0, 5));
  };

  const selectDestination = (destination) => {
    setSearchQuery(`${destination.name}, ${destination.country}`);
    setSelectedLocationId(destination.id);
    setShowSuggestions(false);
  };

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
        <div className="grid grid-cols-1 gap-4 relative" ref={searchRef}>
          {/* Destination Input */}
          <div className="space-y-1">
            <label className="block text-sm text-blue-950">Location/Tour</label>
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
        </div>

        {/* Search Button */}
        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Tours</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default TourSearch;