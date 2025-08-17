"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";
import MobileSearchHeader from "./MobileSearchHeader";
import SearchForm from "./SearchForm";
import MobileSearchForm from "./MobileSearchForm";
import DatePickerModal from "../../../../utils/DatePickerModal";
import GuestModal from "../../../../utils/GuestModal";
import getAllHotels from "@/services/hotel/getAllHotels";

const SearchBar = ({ initialValues }) => {
  const router = useRouter();

  // Modal states
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Guest counts
  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(initialValues?.children || 0);
  const [childAges, setChildAges] = useState(initialValues?.child_ages?.split(',') || []);
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);

  // Data states
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialValues?.locationID || "");
  const [selectedHotelId, setSelectedHotelId] = useState(initialValues?.hotelID || "");
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Search input and suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFirstInputInteraction, setIsFirstInputInteraction] = useState(true);

  const [error, setError] = useState(null);

  // Date handling
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [checkinDate, setCheckinDate] = useState(
    initialValues?.checkin ? new Date(initialValues.checkin) : today
  );
  const [checkoutDate, setCheckoutDate] = useState(
    initialValues?.checkout ? new Date(initialValues.checkout) : tomorrow
  );
  const [dateRange, setDateRange] = useState([checkinDate, checkoutDate]);

  // Guest summary text
  const guestText = `${rooms} Room${rooms > 1 ? "s" : ""}, ${adults} Adult${adults > 1 ? "s" : ""}${
    children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""
  }`;

  // Get destination display name by id
  const getDestinationNameById = (locationID) => {
    const destination = destinations.find((d) => d.id === locationID);
    return destination ? `${destination.name}, ${destination.country}` : "Edit Search Information";
  };

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinationsData, hotelsData] = await Promise.all([
          getDestination(),
          getAllHotels()
        ]);
        
        setDestinations(destinationsData);
        
        // Transform hotel data
        const processedHotels = hotelsData.map(hotel => ({
          id: hotel.hotel_id,
          name: hotel.hotel_name,
          city: hotel.city || hotel.street_address?.split(',')[0] || "Unknown City",
          country: hotel.country || "",
          destinationId: hotel.destination_id || "",
          type: 'hotel',
          starRating: parseInt(hotel.star_rating) || 0,
          image: hotel.image,
          price: hotel.lowest_price || hotel.original_price || 0,
          originalPrice: hotel.original_price,
          discount: hotel.discount,
          street_address: hotel.street_address || "Unknown Street",
        }));
        
        setHotels(processedHotels);

        // Set initial values based on URL params
        if (initialValues?.hotelID) {
          const selectedHotel = processedHotels.find(h => String(h.id) === String(initialValues.hotelID));
          if (selectedHotel) {
            setSelectedHotelId(selectedHotel.id);
            setSearchQuery(`${selectedHotel.name}, ${selectedHotel.city}, ${selectedHotel.country}`);
            setSelectedDestination({
              id: selectedHotel.destinationId,
              name: selectedHotel.city,
              country: selectedHotel.country
            });
          }
        } else if (initialValues?.locationID) {
          const selected = destinationsData.find((d) => String(d.id) === String(initialValues.locationID));
          if (selected) {
            setSelectedLocationId(selected.id);
            setSearchQuery(`${selected.name}, ${selected.country}`);
            setSelectedDestination(selected);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load search data");
      }
    };

    fetchData();
  }, [initialValues]);

  // Matching algorithm
  const calculateMatchScore = (item, query, isHotel = false) => {
    if (!query || !item?.name) return 0;
    
    const itemName = item.name.toLowerCase();
    const itemLocation = isHotel 
      ? `${item.city || ''}, ${item.country || ''}`.toLowerCase()
      : `${item.name || ''}, ${item.country || ''}`.toLowerCase();
    const queryText = query.toLowerCase().trim();
    
    // Exact match bonus
    if (itemName === queryText) return 1000;
    if (itemLocation === queryText) return 950;

    // Partial matches
    if (itemLocation.includes(queryText)) {
      const matchPos = itemLocation.indexOf(queryText);
      return 900 + (matchPos === 0 ? 50 : 0);
    }

    if (itemName.startsWith(queryText)) return 850;
    if (itemName.includes(queryText)) {
      const matchPos = itemName.indexOf(queryText);
      return 800 + (50 - Math.min(matchPos, 50));
    }

    // Word matching
    const queryWords = queryText.split(/\s+/);
    const allWordsMatch = queryWords.every(word => 
      itemName.includes(word) || itemLocation.includes(word)
    );
    if (allWordsMatch) {
      const matchedWordsCount = queryWords.filter(word => 
        itemName.includes(word)
      ).length;
      return 700 + (matchedWordsCount * 50);
    }

    // Partial matching
    let partialMatchScore = 0;
    for (let i = 0; i <= queryText.length - 3; i++) {
      const substring = queryText.substring(i, i + 3);
      if (itemName.includes(substring)) {
        const pos = itemName.indexOf(substring);
        partialMatchScore += 100 + (substring.length * 20) + (pos === 0 ? 50 : (pos < 3 ? 30 : 0));
      }
    }

    if (partialMatchScore > 0) return Math.min(partialMatchScore, 699);

    // Character matching
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

  // Highlight matches
  const highlightMatches = (text, query) => {
    if (!query || !text) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const result = [];
    let lastIndex = 0;
    const matchPos = lowerText.indexOf(lowerQuery);
    
    if (matchPos !== -1) {
      if (matchPos > 0) result.push(text.substring(0, matchPos));
      result.push(
        <span key={matchPos} className="font-bold text-blue-600">
          {text.substring(matchPos, matchPos + lowerQuery.length)}
        </span>
      );
      lastIndex = matchPos + lowerQuery.length;
    }
    if (lastIndex < text.length) result.push(text.substring(lastIndex));
    return result.length > 0 ? result : text;
  };

  // Update suggestions
  const updateSuggestions = (query) => {
    if (!query) {
      setSuggestions([
        ...destinations.map(d => ({ ...d, type: 'destination' })),
        ...hotels.map(h => ({ ...h, type: 'hotel' }))
      ]);
      return;
    }

    const scoredDestinations = destinations.map(dest => ({
      ...dest,
      type: 'destination',
      score: calculateMatchScore(dest, query),
      displayText: `${dest.name}, ${dest.country}`,
      displayLocation: dest.country
    }));

    const scoredHotels = hotels.map(hotel => ({
      ...hotel,
      type: 'hotel',
      score: calculateMatchScore(hotel, query, true),
      displayText: `${hotel.name}, ${hotel.city}, ${hotel.country}`,
      displayLocation: `${hotel.city}, ${hotel.country}`
    }));

    const allItems = [...scoredDestinations, ...scoredHotels]
      .filter(item => item.score > 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.type === 'destination' && b.type !== 'destination') return -1;
        if (a.type !== 'destination' && b.type === 'destination') return 1;
        if (a.name.length !== b.name.length) return a.name.length - b.name.length;
        return a.displayText.localeCompare(b.displayText);
      });

    setSuggestions(allItems.length > 0 ? allItems : []);
  };

  // Input handlers
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
    if (!query) {
      setSelectedLocationId("");
      setSelectedHotelId("");
      setSelectedDestination(null);
    }
  };

  const handleSearchFocus = () => {
    if (isFirstInputInteraction) {
      setIsFirstInputInteraction(false);
      setSearchQuery("");
      setSelectedLocationId("");
      setSelectedHotelId("");
      setSelectedDestination(null);
      updateSuggestions("");
    } else {
      updateSuggestions(searchQuery);
    }
    setShowSuggestions(true);
  };

  const selectDestination = (item) => {
    if (item.type === 'hotel') {
      setSearchQuery(`${item.name}, ${item.city}, ${item.country}`);
      setSelectedHotelId(item.id);
      setSelectedLocationId(item.destinationId || "");
      setSelectedDestination({
        id: item.destinationId || "",
        name: item.city,
        country: item.country
      });
    } else {
      setSearchQuery(`${item.name}, ${item.country}`);
      setSelectedLocationId(item.id);
      setSelectedHotelId("");
      setSelectedDestination(item);
    }
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!selectedDestination && !selectedHotelId) {
      alert("Please select a valid destination or hotel");
      return;
    }

    const queryParams = new URLSearchParams({
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
      rooms: String(rooms),
      adult: String(adults),
      ...(children > 0 && { children: String(children) }),
      ...(childAges.length > 0 && { child_ages: childAges.join(',') }),
      ...(selectedHotelId && { hotelID: String(selectedHotelId) }),
      ...(!selectedHotelId && selectedLocationId && { locationID: String(selectedLocationId) })
    }).toString();

    router.push(`/hotel/list?${queryParams}`);
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
      <div className="bg-white rounded-xl max-w-7xl mx-auto p-4 text-center">
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
    <div className="bg-white rounded-xl max-w-7xl mx-auto">
      {!showMobileSearch && (
        <MobileSearchHeader
          selectedLocationId={selectedLocationId}
          selectedHotelId={selectedHotelId}
          checkinDate={checkinDate}
          checkoutDate={checkoutDate}
          guestText={guestText}
          getDestinationNameById={getDestinationNameById}
           setSearchQuery={setSearchQuery}
          setShowMobileSearch={setShowMobileSearch}
          destinations={destinations}
          hotels={hotels}
          searchQuery={searchQuery}
        />
      )}
  {showMobileSearch && (
        <MobileSearchForm
           searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchFocus={handleSearchFocus}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        selectDestination={selectDestination}
        checkinDate={checkinDate}
        checkoutDate={checkoutDate}
        setShowDatePicker={setShowDatePicker}
        guestText={guestText}
        setShowGuestModal={setShowGuestModal}
        handleSearch={handleSearch}
        setShowSuggestions={setShowSuggestions}
        highlightMatches={highlightMatches}
        formatDate={formatDate}
        />
      )}
      <SearchForm
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchFocus={handleSearchFocus}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
        selectDestination={selectDestination}
        checkinDate={checkinDate}
        checkoutDate={checkoutDate}
        setShowDatePicker={setShowDatePicker}
        guestText={guestText}
        setShowGuestModal={setShowGuestModal}
        handleSearch={handleSearch}
        setShowSuggestions={setShowSuggestions}
        highlightMatches={highlightMatches}
        formatDate={formatDate}
      />

    

      {showDatePicker && (
        <DatePickerModal
          dateRange={dateRange}
          handleDateChange={handleDateChange}
          setShowDatePicker={setShowDatePicker}
        />
      )}

      {showGuestModal && (
        <GuestModal
          adults={adults}
          setAdults={setAdults}
          childrenNumber={children}
          setChildren={setChildren}
          childAges={childAges}
          setChildAges={setChildAges}
          rooms={rooms}
          setRooms={setRooms}
          setShowGuestModal={setShowGuestModal}
        />
      )}
    </div>
  );
};

export default SearchBar;