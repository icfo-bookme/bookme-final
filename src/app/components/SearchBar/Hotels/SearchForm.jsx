'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchButton from "@/utils/SearchButton";
import DatePickerModal from "@/utils/DatePickerModal";
import GuestModal from "@/utils/GuestModal";
import LocationSearch from "./LocationSearch";
import DateInput from "./DateInput";
import GuestInput from "./GuestInput";

const SearchForm = ({ destinations, hotels, defaultDestination }) => {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState(defaultDestination?.id || "");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    defaultDestination ? `${defaultDestination.name}, ${defaultDestination.country}` : ""
  );

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [dateRange, setDateRange] = useState([today, tomorrow]);
  const [checkinDate, setCheckinDate] = useState(today);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow);

  const datePickerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedLocationId && !selectedHotelId) {
      alert("Please select a valid destination or hotel");
      return;
    }

    const formatDateForQuery = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const queryParams = {
      checkin: formatDateForQuery(checkinDate),
      checkout: formatDateForQuery(checkoutDate),
      rooms: String(rooms),
      adult: String(adults),
      child_ages: Array(children).fill(0).join(","),
    };

    if (selectedLocationId) {
      queryParams.locationID = String(selectedLocationId);
    } else if (selectedHotelId) {
      queryParams.hotelID = String(selectedHotelId);
    }

    const query = new URLSearchParams(queryParams).toString();
    router.push(`/hotel/list?${query}`);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0]) setCheckinDate(update[0]);
    if (update[1]) setCheckoutDate(update[1]);
  };

  return (
    <div className="max-w-5xl rounded-t-lg mx-auto pb-6 text-blue-950 relative">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl shadow-sm">
          <LocationSearch
            destinations={destinations}
            hotels={hotels}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            selectedHotelId={selectedHotelId}
            setSelectedHotelId={setSelectedHotelId}
          />

          <DateInput
            label="CHECK IN"
            date={checkinDate}
            onClick={() => setShowDatePicker(true)}
          />

          <DateInput
            label="CHECK OUT"
            date={checkoutDate}
            onClick={() => setShowDatePicker(true)}
          />

          <GuestInput
            adults={adults}
            children={children}
            rooms={rooms}
            onClick={() => setShowGuestModal(true)}
          />
        </div>

        {showDatePicker && (
          <DatePickerModal
            dateRange={dateRange}
            handleDateChange={handleDateChange}
            setShowDatePicker={setShowDatePicker}
            ref={datePickerRef}
          />
        )}

        {showGuestModal && (
          <GuestModal
            adults={adults}
            setAdults={setAdults}
            childrenNumber={children}
            setChildren={setChildren}
            rooms={rooms}
            setRooms={setRooms}
            setShowGuestModal={setShowGuestModal}
          />
        )}

        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
          <SearchButton type="submit">Search Hotels</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;