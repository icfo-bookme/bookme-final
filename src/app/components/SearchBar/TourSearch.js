"use client";

import { useEffect, useState, useRef } from "react";
import SearchField from "../../../utils/SearchField";
import SearchButton from "../../../utils/SearchButton";
import getTourDestination from "@/services/getTourDestination";
import LoadingSpinner from "@/utils/LoadingSpinner";
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


  if (error) return <div className="text-red-500 p-4">{error}</div>;

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
