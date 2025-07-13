"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchField from "./SearchField";
import SearchButton from "./SearchButton";
import getDestination from "@/services/hotel/getDestination";

const HotelSearch = () => {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [destinations, setDestinations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");

  // Set default dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', weekday: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const year = date.getFullYear().toString().slice(-2);
    return formattedDate.replace(/(\w+ \d+, )(\w+)/, `$1'${year} $2`);
  };

  const [checkinDate, setCheckinDate] = useState(today.toISOString().split('T')[0]);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [displayCheckin, setDisplayCheckin] = useState(formatDate(today));
  const [displayCheckout, setDisplayCheckout] = useState(formatDate(tomorrow));
  const [showCheckinCalendar, setShowCheckinCalendar] = useState(false);
  const [showCheckoutCalendar, setShowCheckoutCalendar] = useState(false);

  // Fetch destination list from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestination();
        setDestinations(data);

        if (data.length > 0) {
          setSelectedLocationId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const guestText = `${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child${
    children !== 1 ? "ren" : ""
  }, ${rooms} Room${rooms > 1 ? "s" : ""}`;

  const handleSearch = (e) => {
    e.preventDefault();
    
    const query = new URLSearchParams({
      checkin: checkinDate,
      checkout: checkoutDate,
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      child_ages: "",
      adult: String(adults),
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleCheckinChange = (e) => {
    const newDate = new Date(e.target.value);
    setCheckinDate(e.target.value);
    setDisplayCheckin(formatDate(newDate));
    
    // Ensure checkout is after checkin
    const checkout = new Date(checkoutDate);
    if (newDate >= checkout) {
      const nextDay = new Date(newDate);
      nextDay.setDate(newDate.getDate() + 1);
      setCheckoutDate(nextDay.toISOString().split('T')[0]);
      setDisplayCheckout(formatDate(nextDay));
    }
    
    setShowCheckinCalendar(false);
  };

  const handleCheckoutChange = (e) => {
    const newDate = new Date(e.target.value);
    setCheckoutDate(e.target.value);
    setDisplayCheckout(formatDate(newDate));
    setShowCheckoutCalendar(false);
  };

  const toggleCheckinCalendar = () => {
    setShowCheckinCalendar(!showCheckinCalendar);
    setShowCheckoutCalendar(false);
  };

  const toggleCheckoutCalendar = () => {
    setShowCheckoutCalendar(!showCheckoutCalendar);
    setShowCheckinCalendar(false);
  };

  return (
    <div className="bg-white relative max-w-5xl mx-auto pb-6 text-blue-950">
      <form onSubmit={handleSearch}>
        {/* Grid layout changes for responsiveness */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Destination - Full width on mobile, first in order */}
          <div className="col-span-2 md:col-span-1 space-y-1">
            <label className="block text-sm font-medium text-blue-950">
              City/Hotel/Resort/Area
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950 text-sm sm:text-base"
            >
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
          </div>

          {/* Check In - Half width on mobile, second in order */}
          <div className="sm:col-span-1 space-y-1 relative">
            <label className="block text-sm font-medium text-blue-950">
              Check In
            </label>
            <div
              onClick={toggleCheckinCalendar}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white"
            >
              <div className="font-medium text-blue-950 text-sm sm:text-base">{displayCheckin}</div>
            </div>
            {showCheckinCalendar && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                <input
                  type="date"
                  value={checkinDate}
                  onChange={handleCheckinChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="p-2 border rounded text-sm sm:text-base"
                />
              </div>
            )}
          </div>

          {/* Check Out - Half width on mobile, third in order */}
          <div className="sm:col-span-1 space-y-1 relative">
            <label className="block text-sm font-medium text-blue-950">
              Check Out
            </label>
            <div
              onClick={toggleCheckoutCalendar}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white"
            >
              <div className="font-medium text-blue-950 text-sm sm:text-base">{displayCheckout}</div>
            </div>
            {showCheckoutCalendar && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                <input
                  type="date"
                  value={checkoutDate}
                  onChange={handleCheckoutChange}
                  min={checkinDate}
                  className="p-2 border rounded text-sm sm:text-base"
                />
              </div>
            )}
          </div>

          {/* Guests & Rooms - Full width on mobile, fourth in order */}
          <div className="col-span-2 md:col-span-1 space-y-1">
            <label className="block text-sm font-medium text-blue-950">
              Guests & Rooms
            </label>
            <div
              onClick={() => setShowGuestModal(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white"
            >
              <div className="font-medium text-blue-950 text-sm sm:text-base">{guestText}</div>
            </div>
          </div>
        </div>

        {/* Guest Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-blue-950">Guests & Rooms</h2>

              {[["Adults", adults, setAdults, 1], ["Children", children, setChildren, 0], ["Rooms", rooms, setRooms, 1]].map(
                ([label, count, setter, min]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm sm:text-base">{label}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setter(Math.max(count - 1, min))}
                        className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm sm:text-base">{count}</span>
                      <button
                        type="button"
                        onClick={() => setter(count + 1)}
                        className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm sm:text-base"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Button - Responsive positioning */}
        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2  -translate-x-1/2  md:translate-x-0 flex justify-end">
  <SearchButton type="submit">Search Hotels</SearchButton>
</div>

       
      </form>
    </div>
  );
};

export default HotelSearch;