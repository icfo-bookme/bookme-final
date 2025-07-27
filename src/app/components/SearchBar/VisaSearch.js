"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchButton from "../../../utils/SearchButton";
import getCountries from "@/services/visa/getCountries";

const VisaSearch = () => {
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
        const response = await getCountries();
        console.log("Visa destinations response:", response);
        if (response) {
          setDestinations(response.data);

          if (response.data.length > 0) {
            const first = response.data[0];
            setSearchQuery(first.name);
            setSelectedLocationId(first.id);
          }
        } else {
          setError("No visa destinations available");
        }
      } catch (error) {
        setError("Failed to load visa destinations. Please try again later.");
        console.error("Error fetching visa destinations:", error);
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
    router.push(`/visa/${selectedLocationId}`);
  };

  const calculateMatchScore = (destination, query) => {
    const queryLower = query.toLowerCase();
    const fullText = destination.name.toLowerCase();
    
    // Exact match at start gets highest score
    if (fullText.startsWith(queryLower)) {
      return 100;
    }
    
    // Contains the query as substring
    if (fullText.includes(queryLower)) {
      return 90;
    }
    
    // Check if at least 2 characters match in order (fuzzy match)
    let matchedChars = 0;
    let lastMatchPos = -1;
    
    for (let qIndex = 0; qIndex < queryLower.length; qIndex++) {
      const char = queryLower[qIndex];
      const foundPos = fullText.indexOf(char, lastMatchPos + 1);
      
      if (foundPos > -1) {
        matchedChars++;
        lastMatchPos = foundPos;
      }
    }
    
    // If at least 2 characters matched in order
    if (matchedChars >= 2) {
      // Calculate score based on how many characters matched and how close they are
      const charMatchRatio = matchedChars / queryLower.length;
      const spread = lastMatchPos - fullText.indexOf(queryLower[0]);
      const proximityScore = spread > 0 ? (1 / spread) : 1;
      
      return 50 + (50 * charMatchRatio * proximityScore);
    }
    
    // No match
    return 0;
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
    setSelectedLocationId("");
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
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query)
    }));

    // Filter out destinations with score 0 and sort by score descending
    const matched = scoredDestinations
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    setSuggestions(matched);
  };

  const selectDestination = (destination) => {
    setSearchQuery(destination.name);
    setSelectedLocationId(destination.id);
    setShowSuggestions(false);
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 gap-4 relative" ref={searchRef}>
          <div className="space-y-1">
            <label className="block text-sm text-blue-950">Destination Country</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search visa destinations..."
              className="p-3 font-bold border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950 text-sm sm:text-base"
              aria-autocomplete="list"
              aria-controls="visa-suggestions"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                id="visa-suggestions"
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {suggestions.map((destination) => (
                  <div
                    key={destination.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                    onClick={() => selectDestination(destination)}
                    role="option"
                    aria-selected={selectedLocationId === destination.id}
                  >
                    {destination.name}
                    {destination.score && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({Math.round(destination.score)}% match)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && searchQuery.length >= 2 && suggestions.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                No matching destinations found
              </div>
            )}
          </div>
        </div>

        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Visa</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default VisaSearch;