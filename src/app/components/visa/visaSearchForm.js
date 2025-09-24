"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function VisaSearchForm({ countryData }) {
  const [departure, setDeparture] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [travelers, setTravelers] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
  const [placeholder, setPlaceholder] = useState('Select country');
  const [stopTypewriter, setStopTypewriter] = useState(false);
  const counterRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  // Typewriter Effect
  useEffect(() => {
    if (!countryData?.length) return;

    const typewriterItems = countryData.map((country) => country.name);
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "";

    const typingSpeed = 50;
    const deletingSpeed = 50;
    const pauseBetweenWords = 3500;

    const typeWriter = () => {
      if (stopTypewriter) return;

      currentText = typewriterItems[currentIndex];

      if (!isDeleting) {
        const displayText = currentText.slice(0, charIndex + 1);
        setPlaceholder(displayText);
        charIndex++;

        if (charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseBetweenWords);
          return;
        }
      } else {
        const displayText = currentText.slice(0, charIndex - 1);
        setPlaceholder(displayText);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % typewriterItems.length;
        }
      }

      const delay = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(typeWriter, delay);
    };

    const startTyping = setTimeout(typeWriter, typingSpeed);

    return () => clearTimeout(startTyping);
  }, [countryData, stopTypewriter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (counterRef.current && !counterRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!countryData) return;

    if (searchQuery === '') {
      setFilteredCountries(countryData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const queryChars = query.split('');

    const filtered = countryData
      .map((country) => {
        const name = country.name.toLowerCase();
        let score = 0;
        let consecutiveBonus = 0;
        let lastMatchIndex = -2;

        queryChars.forEach((char) => {
          const charIndex = name.indexOf(char);
          if (charIndex !== -1) {
            score += 1;
            if (lastMatchIndex === charIndex - 1 || lastMatchIndex === charIndex) {
              consecutiveBonus += 1;
            }
            lastMatchIndex = charIndex;
          }
        });

        const totalScore = score + consecutiveBonus * 0.5;

        return {
          ...country,
          score: totalScore,
          isMatch: score > 0,
        };
      })
      .filter((country) => country.isMatch)
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return a.name.length - b.name.length;
      });

    setFilteredCountries(filtered);
  }, [searchQuery, countryData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!departure) {
      alert("Please select a country");
      return;
    }
    const selectedCountry = countryData.find((c) => c?.name === departure);
    if (!selectedCountry) return;
    router.push(`/visa/${slugify(selectedCountry?.name)}/${selectedCountry?.id}`);
  };

  const currentCountryCode = countryData?.find((c) => c.name === departure)?.code || '';

  const incrementTravelers = () => setTravelers((prev) => Math.min(prev + 1, 10));
  const decrementTravelers = () => setTravelers((prev) => Math.max(prev - 1, 1));

  const handleInputFocus = () => {
    setStopTypewriter(true);
    setIsOpen(true);
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery('');
      setDeparture('');
      setFilteredCountries(countryData || []);
    }
  };

  const handleCountrySelect = (country) => {
    setStopTypewriter(true);
    setDeparture(country?.name);
    setSearchQuery(country?.name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setStopTypewriter(true);
    setSearchQuery(e.target.value);
    setDeparture(e.target.value);
    setIsOpen(true);
  };

  const calculateMatchScore = (item, query) => {
    if (!query) return 0;

    const itemName = item?.name?.toLowerCase();
    const queryText = query.toLowerCase().trim();

    if (itemName === queryText) return 1000;
    if (itemName.includes(queryText)) {
      const matchPos = itemName.indexOf(queryText);
      return 900 + (matchPos === 0 ? 50 : 0);
    }
    if (itemName.startsWith(queryText)) return 850;

    const queryWords = queryText.split(/\s+/);
    const allWordsMatch = queryWords.every((word) => itemName.includes(word));
    if (allWordsMatch) {
      const matchedWordsCount = queryWords.filter((word) => itemName.includes(word)).length;
      return 700 + matchedWordsCount * 50;
    }

    let partialMatchScore = 0;
    for (let i = 0; i <= queryText.length - 3; i++) {
      const substring = queryText.substring(i, i + 3);
      if (itemName.includes(substring)) {
        const pos = itemName.indexOf(substring);
        partialMatchScore += 100 + substring.length * 20 + (pos === 0 ? 50 : pos < 3 ? 30 : 0);
      }
    }

    return partialMatchScore > 0 ? Math.min(partialMatchScore, 699) : 0;
  };

  const getFilteredCountriesWithScore = () => {
    if (!searchQuery) return countryData || [];
    const scoredItems = (countryData || []).map((c) => ({
      ...c,
      score: calculateMatchScore(c, searchQuery),
    }));
    return scoredItems.filter((i) => i.score > 50).sort((a, b) => b.score - a.score);
  };

  const highlightMatches = (text, query) => {
    if (!query) return text;
    const queryChars = new Set(query.toLowerCase());
    return (
      <>
        {text.split("").map((char, idx) =>
          queryChars.has(char.toLowerCase()) ? (
            <span key={idx} className="font-bold text-blue-600">
              {char}
            </span>
          ) : (
            <span key={idx}>{char}</span>
          )
        )}
      </>
    );
  };

  const displayedCountries = searchQuery ? getFilteredCountriesWithScore() : countryData || [];

  return (
    <form
      onSubmit={handleSearch}
      className="font-sans text-black relative -mt-32 md:-mt-20 w-full bg-white max-w-4xl px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-md mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:gap-4">

          {/* Search Visa For Label + Input */}
          <div className="relative border border-gray-200 px-3 py-2 rounded-lg flex-1 min-w-[150px]" ref={dropdownRef}>
            <label className="text-xs text-gray-500 font-semibold mb-1 block">Search visa for</label>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500 font-bold mr-2">{currentCountryCode}</span>
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onClick={() => setIsOpen(true)}
                className="w-full outline-none text-base md:text-[18px] bg-transparent"
              />
            </div>

            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {displayedCountries.length > 0 ? (
                  displayedCountries.map((country, index) => (
                    <div
                      key={country?.id}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                        departure === country.name ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span className="text-gray-500 font-bold mr-2 w-6">{country?.code}</span>
                      <span className="flex-1 truncate">{highlightMatches(country?.name, searchQuery)}</span>
                      {index === 0 && searchQuery && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                          Best match
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>

          {/* Travelers Counter */}
          <div
            className="px-3 py-2 rounded-lg border border-gray-200 flex-1 min-w-[150px] relative h-[60px] cursor-pointer"
            onClick={() => setIsEditing(true)}
            ref={counterRef}
          >
            <div className="flex items-center w-full h-full text-black">
              <div
                className={`flex items-center w-full h-full transition-all duration-300 ${
                  isEditing ? 'opacity-0 scale-95 absolute' : 'opacity-100 scale-100'
                }`}
              >
                <span className="font-semibold mr-2 text-lg">{String(travelers).padStart(2, '0')}</span>
                <div className="w-[1px] h-full bg-gray-700 mx-2"></div>
                <div className="flex flex-col">
                  <div className="font-bold text-gray-500">Travelers</div>
                  <div className="text-xs font-semibold">Bangladeshi</div>
                </div>
              </div>

              <div
                className={`flex items-center justify-center w-full h-full transition-all duration-300 ${
                  isEditing ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                }`}
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementTravelers();
                    }}
                    className="w-[25px] h-[30px] flex justify-center items-center text-center text-3xl rounded-lg text-white font-bold"
                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                    disabled={travelers <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-bold mx-2 w-6 text-center">{String(travelers).padStart(2, '0')}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementTravelers();
                    }}
                    className="w-[25px] h-[30px] flex justify-center items-center text-center text-3xl rounded-lg text-white font-bold"
                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                    disabled={travelers >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer min-w-[40px] sm:min-w-[50px] hover:bg-blue-600 transition-colors"
          style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm4.293-4.293l5.414 5.414" />
          </svg>
        </button>
      </div>
    </form>
  );
}
