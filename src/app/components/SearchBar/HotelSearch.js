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
  const [checkinDate, setCheckinDate] = useState("2025-07-15");
  const [checkoutDate, setCheckoutDate] = useState("2025-07-17");

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
      child_ages: "", // You can extend this if needed
      adult: String(adults),
    }).toString();

    // Use router.push for client-side navigation
    router.push(`/hotel/list?${query}`);
  };

  const handleCheckinChange = (e) => {
    setCheckinDate(e.target.value);
  };

  const handleCheckoutChange = (e) => {
    setCheckoutDate(e.target.value);
  };

  return (
    <div className="bg-white relative max-w-5xl pb-6 text-blue-950">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-950">
              Destination
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white w-full text-blue-950"
            >
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
          </div>

          {/* Check In */}
          <SearchField 
            label="Check In" 
            type="date" 
            value={checkinDate}
            onChange={handleCheckinChange}
            name="checkin" 
          />

          {/* Check Out */}
          <SearchField 
            label="Check Out" 
            type="date" 
            value={checkoutDate}
            onChange={handleCheckoutChange}
            name="checkout" 
          />

          {/* Guests & Rooms */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-950">
              Guests & Rooms
            </label>
            <div
              onClick={() => setShowGuestModal(true)}
              className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-900 transition-colors bg-white"
            >
              <div className="font-medium text-blue-950">{guestText}</div>
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
                    <span>{label}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setter(Math.max(count - 1, min))}
                        className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{count}</span>
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
                  className="mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 absolute flex justify-end left-[43%]">
          <SearchButton type="submit">Search Hotels</SearchButton>
        </div>
      </form>
    </div>
  );
};

export default HotelSearch;