'use client';

import { useEffect, useState, useRef } from "react";
import getTourDestination from "@/services/getTourDestination";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";
import SearchButton from "@/utils/SearchButton";
import useScrollOnClick from "@/hooks/useScrollOnFocus";

const ShipsSearch = () => {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [placeholder, setPlaceholder] = useState("Search destinations...");
  const [stopTypewriter, setStopTypewriter] = useState(false);
  const [inputRef, handleClick] = useScrollOnClick(150);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTourDestination();
        if (response?.success) {
          const visibleDestinations = response.data.filter((dest) => dest.isShow === "yes");
          setDestinations(visibleDestinations);
        }
      } catch (error) {
        setError("Failed to load destinations");
        console.error("Error loading destinations:", error);
      }
    };

    fetchData();
  }, []);

  // Typewriter effect for placeholder with "Search Ships For" prefix
  useEffect(() => {
    if (!destinations.length) return;

    const typewriterItems = destinations.map(dest => `${dest.name}, ${dest.country}`);
    const prefix = "Search Ships For ";

    let currentIndex = 0;    
    let charIndex = 0;     
    let isDeleting = false;  
    let currentText = "";

    const typingSpeed = 120;    
    const deletingSpeed = 120;    
    const pauseBetweenWords = 3500; 

    const typeWriter = () => {
      if (stopTypewriter) return; 

      currentText = typewriterItems[currentIndex];

      if (!isDeleting) {
        // Typing characters forward - always show prefix + current text
        const displayText = prefix + currentText.slice(0, charIndex + 1);
        setPlaceholder(displayText);
        charIndex++;

        // If full text is typed, start deleting after pause
        if (charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseBetweenWords);
          return;
        }
      } else {
        // Deleting characters - always keep prefix
        const displayText = prefix + currentText.slice(0, charIndex - 1);
        setPlaceholder(displayText);
        charIndex--;

        // When fully deleted, move to the next item
        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % typewriterItems.length;
        }
      }

      // Adjust speed for typing or deleting
      const delay = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(typeWriter, delay);
    };

    const startTyping = setTimeout(typeWriter, typingSpeed);

    return () => clearTimeout(startTyping);
  }, [destinations, stopTypewriter]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateMatchScore = (item, query) => {
    if (!query) return 0;

    const itemName = item?.name?.toLowerCase();
    const itemLocation = item?.country?.toLowerCase();
    const itemFullText = `${itemName}, ${itemLocation}`.toLowerCase();
    const queryText = query.toLowerCase().trim();

    if (itemName === queryText) return 1000;
    if (itemFullText === queryText) return 950;

    if (itemFullText.includes(queryText)) {
      const matchPos = itemFullText.indexOf(queryText);
      return 900 + (matchPos === 0 ? 50 : 0);
    }

    if (itemName.startsWith(queryText)) return 850;

    if (itemName.includes(queryText)) {
      const matchPos = itemName.indexOf(queryText);
      return 800 + (50 - Math.min(matchPos, 50));
    }

    const queryWords = queryText.split(/\s+/);
    const allWordsMatch = queryWords.every(word =>
      (itemName || '').includes(word) || (itemLocation || '').includes(word)
    );
    if (allWordsMatch) {
      const matchedWordsCount = queryWords.filter(word =>
        itemName.includes(word)
      ).length;
      return 700 + (matchedWordsCount * 50);
    }

    let partialMatchScore = 0;
    for (let i = 0; i <= queryText.length - 3; i++) {
      const substring = queryText.substring(i, i + 3);
      if (itemName.includes(substring)) {
        const pos = itemName.indexOf(substring);
        partialMatchScore += 100 +
          (substring.length * 20) +
          (pos === 0 ? 50 : (pos < 3 ? 30 : 0));
      }
    }

    if (partialMatchScore > 0) return Math.min(partialMatchScore, 699);

    let charMatchScore = 0;
    let queryIndex = 0;
    for (let i = 0; i < itemName.length && queryIndex < queryText.length; i++) {
      if (itemName[i] === queryText[queryIndex]) {
        charMatchScore += 10;
        queryIndex++;
      }
    }

    return Math.min((charMatchScore / queryText.length) * 100, 600);
  };

  const updateSuggestions = (query) => {
    if (!query) {
      const defaultSuggestions = destinations.map(dest => ({
        ...dest,
        type: 'destination',
        score: 0,
        displayName: `${dest.name}, ${dest.country}`
      }));
      setSuggestions(defaultSuggestions);
      return;
    }

    const scoredItems = destinations.map(dest => ({
      ...dest,
      type: 'destination',
      score: calculateMatchScore(dest, query),
      displayName: `${dest.name}, ${dest.country}`
    }));

    const sorted = scoredItems
      .filter(item => item.score > 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        const aNameLength = a.name.length;
        const bNameLength = b.name.length;
        if (aNameLength !== bNameLength) return aNameLength - bNameLength;

        return a.displayName.localeCompare(b.displayName);
      });

    setSuggestions(sorted);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setStopTypewriter(true); // Stop typewriter once user types
    updateSuggestions(query);

    if (!query) {
      setSelectedLocationId("");
    }
  };

  const handleSearchFocus = () => {
    setStopTypewriter(true); // Stop typewriter when input is focused
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedLocationId("");
      setSuggestions(destinations.map(d => ({ ...d, type: 'destination' })));
    } else {
      updateSuggestions(searchQuery);
    }
    setShowSuggestions(true);
  };

  const selectItem = (item) => {
    setStopTypewriter(true); // Stop typewriter when selecting an item
    setSearchQuery(`${item.name}, ${item.country}`);
    setSelectedLocationId(item.id);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Please select a valid destination");
      return;
    }

    const selectedDestination = destinations.find(dest => dest.id === selectedLocationId);

    if (selectedDestination) {
      const destinationSlug = slugify(selectedDestination.name);
      router.push(`/tour/${destinationSlug}/${selectedLocationId}`);
    } else {
      router.push(`/tour/${selectedLocationId}`);
    }
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

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0980-\u09FF\-]+/g, '')
      .replace(/\-\-+/g, '-');

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
          <div className="space-y-1 relative">
            <label className="block text-sm text-blue-950 font-medium">LOCATION/TOUR</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuMapPin className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="text"
                ref={inputRef}
                value={searchQuery}
                onClick={handleClick}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder={placeholder}
                className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg pl-10"
              />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center"
                    onClick={() => selectItem(item)}
                  >
                    <div>
                      {highlightMatches(item.name, searchQuery)},{" "}
                      {highlightMatches(item.country, searchQuery)}
                    </div>
                    {idx === 0 && item.score > 50 && (
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
          <SearchButton type="submit">Search Ships</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default ShipsSearch;