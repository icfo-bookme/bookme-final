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

  // Enhanced fuzzy matching algorithm
  const calculateMatchScore = (destination, query) => {
    const queryLower = query.toLowerCase();
    const fullText = destination.name.toLowerCase();
    
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
    const proximityScore = 30 / (spread + 1);
    
    // 3. Bonus for matches at word starts
    let wordStartBonus = 0;
    const words = fullText.split(/[\s,]+/);
    words.forEach(word => {
      if (word.startsWith(queryLower[0])) {
        wordStartBonus += 20;
      }
    });
    
    const totalScore = matchPercentage + proximityScore + wordStartBonus;
    return Math.min(100, Math.round(totalScore));
  };

  // Highlight matching characters in the suggestion
  const highlightMatches = (text, query) => {
    if (!query) return text;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const result = [];
    let lastIndex = 0;
    
    for (let i = 0; i < queryLower.length; i++) {
      const char = queryLower[i];
      const index = textLower.indexOf(char, lastIndex);
      
      if (index !== -1) {
        // Add non-matched text before this match
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        
        // Add matched character with highlighting
        result.push(
          <span key={index} className="font-bold text-blue-600">
            {text.substring(index, index + 1)}
          </span>
        );
        
        lastIndex = index + 1;
      }
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length > 0 ? result : text;
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

    // Calculate scores for all destinations
    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      score: calculateMatchScore(dest, query)
    }));

    // Filter and sort by score
    const matched = scoredDestinations
      .filter(dest => dest.score > 0)
      .sort((a, b) => b.score - a.score);

    setSuggestions(matched.length > 0 ? matched.slice(0, 10) : []);
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
              value={isFirstInputInteraction && !searchQuery ? destinations[0]?.name || '' : searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder={isFirstInputInteraction ? "" : "Search visa destinations..."}
              className="p-3 font-bold border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950 text-sm sm:text-base"
              aria-autocomplete="list"
              aria-controls="visa-suggestions"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                id="visa-suggestions"
                className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {suggestions.map((destination, index) => (
                  <div
                    key={destination.id}
                    className={`p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center ${
                      selectedLocationId === destination.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => selectDestination(destination)}
                    role="option"
                    aria-selected={selectedLocationId === destination.id}
                  >
                    <div>
                      {highlightMatches(destination.name, searchQuery)}
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