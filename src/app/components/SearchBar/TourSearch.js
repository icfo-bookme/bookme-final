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

  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTourDestination();
        if (response?.success) {
          const visibleDestinations = response.data.filter((dest) => dest.isShow === "yes");
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

  // Levenshtein Distance
  const levenshteinDistance = (a, b) => {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + 1
          );
        }
      }
    }

    return dp[m][n];
  };

  const calculateMatchScore = (destination, query) => {
    const destText = `${destination.name}, ${destination.country}`.toLowerCase().replace(/[^a-z]/g, "");
    const queryText = query.toLowerCase().replace(/[^a-z]/g, "");
    if (!queryText) return 0;

    const levDist = levenshteinDistance(queryText, destText);
    const maxLen = Math.max(destText.length, queryText.length);
    const levScore = Math.max(0, 100 - (levDist / maxLen) * 100);

    const destFreq = {};
    const queryFreq = {};
    for (const char of destText) destFreq[char] = (destFreq[char] || 0) + 1;
    for (const char of queryText) queryFreq[char] = (queryFreq[char] || 0) + 1;

    let matchScore = 0;
    let totalPossible = 0;
    for (const char in destFreq) {
      const matchCount = Math.min(destFreq[char], queryFreq[char] || 0);
      matchScore += matchCount;
      totalPossible += destFreq[char];
    }

    const overlapScore = (matchScore / totalPossible) * 100;
    return Math.round(0.6 * levScore + 0.4 * overlapScore);
  };

  const highlightMatches = (text, query) => {
    if (!query) return text;

    const queryChars = new Set(query.toLowerCase());
    return (
      <>
        {text.split("").map((char, idx) => (
          queryChars.has(char.toLowerCase()) ? (
            <span key={idx} className="font-bold text-blue-600">{char}</span>
          ) : (
            <span key={idx}>{char}</span>
          )
        ))}
      </>
    );
  };

  const updateSuggestions = (query) => {
    if (!query) {
      setSuggestions(destinations);
      return;
    }

    const scored = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query)
    }));

    const matched = scored
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    setSuggestions(matched);
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
          <div className="space-y-1">
            <label className="block text-sm text-blue-950">Location/Tour</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search destinations..."
              className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((destination, idx) => (
                  <div
                    key={destination.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center"
                    onClick={() => selectDestination(destination)}
                  >
                    <div>
                      {highlightMatches(destination.name, searchQuery)},{" "}
                      {highlightMatches(destination.country, searchQuery)}
                    </div>
                    {idx === 0 && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                        Best match
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Tours</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default TourSearch;
