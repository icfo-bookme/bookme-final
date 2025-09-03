"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExchangeAlt } from "react-icons/fa";
import SearchButton from "@/utils/SearchButton";

const CarRentalSearchBar = ({ locationsData }) => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState({
        pickupLocation: "",
        dropoffLocation: "",
        pickupDate: "",
        pickupTime: "10:00",
    });
    const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
    const [selectedDropoffLocation, setSelectedDropoffLocation] = useState(null);
    const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
    const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
    const [filteredPickupLocations, setFilteredPickupLocations] = useState([]);
    const [filteredDropoffLocations, setFilteredDropoffLocations] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize with default data if available
    useEffect(() => {
        if (locationsData?.length > 0) {
            setFilteredPickupLocations(locationsData);
            setFilteredDropoffLocations(locationsData);

            // Set initial search query with first location
            setSearchParams(prev => ({
                ...prev,
                pickupLocation: `${locationsData[0].name}, ${locationsData[0].country}`,
                dropoffLocation: `${locationsData[0].name}, ${locationsData[0].country}`,
            }));
            setSelectedPickupLocation(locationsData[0]);
            setSelectedDropoffLocation(locationsData[0]);

            // Set default date (today)
            const today = new Date();
            
            setSearchParams(prev => ({
                ...prev,
                pickupDate: today.toISOString().split('T')[0],
            }));
        }
    }, [locationsData]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickupRef.current && !pickupRef.current.contains(event.target)) {
                setShowPickupSuggestions(false);
            }
            if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
                setShowDropoffSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calculate match score for location suggestions
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

    // Update location suggestions based on query
    const updateSuggestions = (query, isPickup) => {
        if (!query) {
            if (isPickup) {
                setFilteredPickupLocations(locationsData);
            } else {
                setFilteredDropoffLocations(locationsData);
            }
            return;
        }

        const scoredItems = locationsData.map(location => ({
            ...location,
            score: calculateMatchScore(location, query),
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

        if (isPickup) {
            setFilteredPickupLocations(sorted);
        } else {
            setFilteredDropoffLocations(sorted);
        }
    };

    // Handle input changes
    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSearchParams(prev => ({ ...prev, [field]: value }));

        if (field === 'pickupLocation') {
            updateSuggestions(value, true);
            setSelectedPickupLocation(null);
        } else if (field === 'dropoffLocation') {
            updateSuggestions(value, false);
            setSelectedDropoffLocation(null);
        }
    };

    // Handle input focus
    const handleInputFocus = (isPickup) => {
        if (isPickup) {
            setShowPickupSuggestions(true);
            updateSuggestions(searchParams.pickupLocation, true);
        } else {
            setShowDropoffSuggestions(true);
            updateSuggestions(searchParams.dropoffLocation, false);
        }
    };

    // Select a location from suggestions
    const selectLocation = (location, isPickup) => {
        const locationText = `${location.name}, ${location.country}`;

        if (isPickup) {
            setSearchParams(prev => ({ ...prev, pickupLocation: locationText }));
            setSelectedPickupLocation(location);
            setShowPickupSuggestions(false);
        } else {
            setSearchParams(prev => ({ ...prev, dropoffLocation: locationText }));
            setSelectedDropoffLocation(location);
            setShowDropoffSuggestions(false);
        }
    };

    // Swap pickup and dropoff locations
    const swapLocations = () => {
        const tempLocation = searchParams.pickupLocation;
        const tempSelected = selectedPickupLocation;

        setSearchParams(prev => ({
            ...prev,
            pickupLocation: prev.dropoffLocation,
            dropoffLocation: tempLocation
        }));

        setSelectedPickupLocation(selectedDropoffLocation);
        setSelectedDropoffLocation(tempSelected);
    };

    // Handle form submission
    const handleSearch = (e) => {
        e.preventDefault();

        if (!selectedPickupLocation || !selectedDropoffLocation) {
            alert("Please select both pickup and dropoff locations from the list");
            return;
        }

        if (!searchParams.pickupDate) {
            alert("Please select a pickup date");
            return;
        }

        // Convert to URL parameters
        const params = new URLSearchParams({
            pickupId: selectedPickupLocation.id,
            dropoffId: selectedDropoffLocation.id,
            pickupDate: searchParams.pickupDate,
            pickupTime: searchParams.pickupTime,
        });

        router.push(`/Car/list/${selectedPickupLocation.id}?${params.toString()}`);
    };

    // Custom SearchField component for location inputs
    const LocationSearchField = ({ label, value, onChange, onFocus, placeholder, fieldRef, showSuggestions, suggestions, onSelectSuggestion }) => (
        <div className="flex-1 w-full min-w-0 relative" ref={fieldRef}>
            <label className="block text-sm text-blue-950 font-medium mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors w-full text-blue-950 text-base font-bold pl-10"
                />
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((location) => (
                        <div
                            key={location.id}
                            className="p-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                            onClick={() => onSelectSuggestion(location)}
                        >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-500">{location.country}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Custom SearchField component for date/time inputs
    const DateTimeSearchField = ({ label, type, value, onChange, min }) => (
        <div className="flex-1 w-full min-w-0">
            <label className="block text-sm text-blue-950 font-medium mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {type === "date" ? (
                        <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                    ) : (
                        <FaClock className="h-4 w-4 text-blue-600" />
                    )}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    min={min}
                    className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors w-full text-blue-950 text-base font-bold pl-10"
                />
            </div>
        </div>
    );

    return (
        <div className="bg-white max-w-6xl mx-auto  pb-6 text-blue-950 rounded-lg ">
            <form onSubmit={handleSearch} className="w-full">
                <div className="flex flex-col md:flex-row items-end gap-3 md:gap-4">
                    {/* Pickup Location */}
                    <div className="w-full md:flex-1">
                        <LocationSearchField
                            label="PICKUP LOCATION"
                            value={searchParams.pickupLocation}
                            onChange={(e) => handleInputChange(e, 'pickupLocation')}
                            onFocus={() => handleInputFocus(true)}
                            placeholder="Enter pickup location"
                            fieldRef={pickupRef}
                            showSuggestions={showPickupSuggestions}
                            suggestions={filteredPickupLocations}
                            onSelectSuggestion={(location) => selectLocation(location, true)}
                        />
                    </div>

                    {/* Swap Button - Only show on desktop */}
                    {!isMobile && (
                        <div className="h-12 flex items-center justify-center md:px-0">
                            <button
                                type="button"
                                onClick={swapLocations}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                aria-label="Swap pickup and dropoff locations"
                            >
                                <FaExchangeAlt className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* Dropoff Location */}
                    <div className="w-full md:flex-1">
                        <LocationSearchField
                            label="DROPOFF LOCATION"
                            value={searchParams.dropoffLocation}
                            onChange={(e) => handleInputChange(e, 'dropoffLocation')}
                            onFocus={() => handleInputFocus(false)}
                            placeholder="Enter dropoff location"
                            fieldRef={dropoffRef}
                            showSuggestions={showDropoffSuggestions}
                            suggestions={filteredDropoffLocations}
                            onSelectSuggestion={(location) => selectLocation(location, false)}
                        />
                    </div>

                    {/* Mobile Swap Button */}
                    {isMobile && (
                        <div className="w-full flex justify-center py-2">
                            <button
                                type="button"
                                onClick={swapLocations}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                aria-label="Swap pickup and dropoff locations"
                            >
                                <FaExchangeAlt className="h-4 w-4" />
                                <span className="text-sm">Swap Locations</span>
                            </button>
                        </div>
                    )}

                    {/* Date and Time Fields */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 md:flex md:flex-1">
                        {/* Pickup Date */}
                        <div className="w-full">
                            <DateTimeSearchField
                                label="PICKUP DATE"
                                type="date"
                                value={searchParams.pickupDate}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, pickupDate: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Pickup Time */}
                        <div className="w-full">
                            <DateTimeSearchField
                                label="PICKUP TIME"
                                type="time"
                                value={searchParams.pickupTime}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, pickupTime: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                       <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 top-44 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Cars</SearchButton>
        </div>
                </div>
            </form>
        </div>
    );
};

export default CarRentalSearchBar;