"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";
import SearchButton from "@/utils/SearchButton";
import { FaHiking } from "react-icons/fa";
import useScrollOnClick from "@/hooks/useScrollOnFocus";

const ActivitiesSearchBar = ({ data }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);
    const [placeholder, setPlaceholder] = useState("Search tour destinations...");
    const [stopTypewriter, setStopTypewriter] = useState(false);
    const searchRef = useRef(null);
    const [inputRef, handleClick] = useScrollOnClick(150);

    useEffect(() => {
        if (data?.length > 0) {
            setFilteredDestinations(data);
        }
    }, [data]);

    // Typewriter effect for placeholder with "Search Activities For" prefix
    useEffect(() => {
        if (!data?.length) return;

        const typewriterItems = data.map(dest => `${dest.name}, ${dest.country}`);
        const prefix = "Search Activities For ";

        let currentIndex = 0;    
        let charIndex = 0;     
        let isDeleting = false;  
        let currentText = "";

        const typingSpeed = 100;    
        const deletingSpeed = 100;    
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
    }, [data, stopTypewriter]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const calculateMatchScore = (item, query) => {
        if (!query) return 0;

        const itemName = item?.name?.toLowerCase();
        const itemCountry = item?.country?.toLowerCase();
        const itemFullText = `${itemName}, ${itemCountry}`.toLowerCase();
        const queryText = query.toLowerCase().trim();

        // Exact match bonus (highest priority)
        if (itemName === queryText) return 1000;
        if (itemFullText === queryText) return 950;

        // Exact match with country
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
            (itemName || '').includes(word) || (itemCountry || '').includes(word)
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
            setFilteredDestinations(data || []);
            return;
        }

        const scoredItems = (data || []).map(dest => ({
            ...dest,
            score: calculateMatchScore(dest, query),
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

                return `${a.name}, ${a.country}`.localeCompare(`${b.name}, ${b.country}`);
            });

        setFilteredDestinations(sorted);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setStopTypewriter(true); // Stop typewriter once user types
        updateSuggestions(query);
        if (!query) {
            setSelectedDestination(null);
        }
    };

    const handleSearchFocus = () => {
        setStopTypewriter(true); // Stop typewriter when input is focused
        if (isFirstInputInteraction) {
            setIsFirstInputInteraction(false);
            setSearchQuery("");
            setSelectedDestination(null);
            setFilteredDestinations(data || []);
        } else {
            updateSuggestions(searchQuery);
        }
        setShowSuggestions(true);
    };

    const selectDestination = (destination) => {
        setStopTypewriter(true); // Stop typewriter when selecting an item
        setSearchQuery(`${destination.name}, ${destination.country}`);
        setSelectedDestination(destination);
        setShowSuggestions(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedDestination) {
            alert("Please select a destination from the list");
            return;
        }
        router.push(`/activities/list/${selectedDestination.id}`);
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

    return (
        <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative ">
            <form onSubmit={handleSearch}>
                <div className="gird grid-cols-2">
                    <div className="grid grid-cols-1 gap-4 relative" ref={searchRef}>
                        <div className="space-y-1 relative">
                            <label className="block text-sm text-blue-950 font-medium">
                                ACTIVITIES/DESTINATION</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaHiking className="h-5 w-5 text-blue-600" />
                                </div>
                                <input
                                    type="text"
                                    ref={inputRef}
                                    onClick={handleClick}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    placeholder={placeholder}
                                    className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg pl-10"
                                />
                            </div>
                            {showSuggestions && filteredDestinations.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredDestinations.map((destination, idx) => (
                                        <div
                                            key={destination.id}
                                            className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base flex justify-between items-center"
                                            onClick={() => selectDestination(destination)}
                                        >
                                            <div>
                                                {highlightMatches(destination.name, searchQuery)},{" "}
                                                {highlightMatches(destination.country, searchQuery)}
                                            </div>
                                            {idx === 0 && destination.score > 50 && (
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
                        <SearchButton type="submit">Search Activities</SearchButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ActivitiesSearchBar;