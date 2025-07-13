// components/SearchBar.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";

const SearchBar = ({ initialValues }) => {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showCheckinCalendar, setShowCheckinCalendar] = useState(false);
  const [showCheckoutCalendar, setShowCheckoutCalendar] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);
  const [destinations, setDestinations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialValues?.locationID || "");
  const [checkinDate, setCheckinDate] = useState(initialValues?.checkin || "");
  const [checkoutDate, setCheckoutDate] = useState(initialValues?.checkout || "");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const checkinRef = useRef(null);
  const checkoutRef = useRef(null);

  // Get destination name by ID
  const getDestinationNameById = (id) => {
    const destination = destinations.find(d => d.id === id);
    return destination ? destination.name : "Edit Search Information";
  };

  // Fetch destination list from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestination();
        setDestinations(data);

        if (data.length > 0) {
          if (initialValues?.locationID) {
            const selected = data.find(d => d.id === initialValues.locationID);
            setSelectedDestination(selected);
          } else {
            setSelectedLocationId(data[0].id);
            setSelectedDestination(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    // Set default dates if not provided
    if (!checkinDate) {
      const today = new Date();
      setCheckinDate(today.toISOString().split('T')[0]);
      
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 2);
      setCheckoutDate(nextDay.toISOString().split('T')[0]);
    }
  }, []);

  const guestText = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}`;

  const handleSearch = (e) => {
    e.preventDefault();
    
    const query = new URLSearchParams({
      checkin: checkinDate,
      checkout: checkoutDate,
      locationID: String(selectedLocationId),
      rooms: String(rooms),
      adult: String(adults),
    }).toString();

    router.push(`/hotel/list?${query}`);
  };

  const handleCheckinChange = (e) => {
    const newDate = e.target.value;
    setCheckinDate(newDate);
    setShowCheckinCalendar(false);
    
    // Auto-set checkout date if it's before checkin
    const checkout = new Date(checkoutDate);
    const checkin = new Date(newDate);
    if (checkout <= checkin) {
      const nextDay = new Date(checkin);
      nextDay.setDate(checkin.getDate() + 2);
      setCheckoutDate(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleCheckoutChange = (e) => {
    setCheckoutDate(e.target.value);
    setShowCheckoutCalendar(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleClickOutside = (e) => {
    if (checkinRef.current && !checkinRef.current.contains(e.target)) {
      setShowCheckinCalendar(false);
    }
    if (checkoutRef.current && !checkoutRef.current.contains(e.target)) {
      setShowCheckoutCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl py-4 max-w-6xl mx-auto">
      {/* Mobile Header - Visible only on small devices when search form is collapsed */}
      {!showMobileSearch && (
        <div className='grid grid-cols-5 md:hidden mb-4 px-4'>
          <div className='col-span-3'>
            <h1 className="text-lg font-semibold text-blue-950 truncate">
              {getDestinationNameById(selectedLocationId)}
            </h1>
            <p className="text-sm text-gray-600">
              {formatDate(checkinDate)} - {formatDate(checkoutDate)}, {guestText}
            </p>
          </div>
          <div className='col-span-2 flex justify-end items-center'>
            <button 
              onClick={() => setShowMobileSearch(true)}
              className="bg-yellow-500 text-blue-950 px-4 text-sm font-bold py-2 rounded-lg"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Desktop Search Form - Hidden on mobile */}
      <form onSubmit={handleSearch} className="w-full hidden md:block">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          {/* Destination Dropdown */}
          <div className="w-full md:w-2/5">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">CITY/HOTEL/RESORT/AREA</label>
            <select
              value={selectedLocationId}
              onChange={(e) => {
                const selected = destinations.find(d => d.id === e.target.value);
                setSelectedLocationId(e.target.value);
                setSelectedDestination(selected);
              }}
              className="p-3 h-14 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors bg-white w-full text-blue-950 text-lg"
            >
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check In */}
          <div className="w-full md:w-1/5 relative" ref={checkinRef}>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">CHECK IN</label>
            <div 
              onClick={() => {
                setShowCheckinCalendar(true);
                setShowCheckoutCalendar(false);
              }}
              className="p-3 h-14 border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
            >
              <span className="text-lg font-medium">{formatDate(checkinDate)}</span>
              <span className="text-xs text-gray-500">
                {new Date(checkinDate).toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>
            {showCheckinCalendar && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                <input
                  type="date"
                  value={checkinDate}
                  onChange={handleCheckinChange}
                  className="w-full p-2 border rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>

          {/* Check Out */}
          <div className="w-full md:w-1/5 relative" ref={checkoutRef}>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">CHECK OUT</label>
            <div 
              onClick={() => {
                setShowCheckoutCalendar(true);
                setShowCheckinCalendar(false);
              }}
              className="p-3 h-14 border border-gray-300 rounded-lg flex flex-col justify-center cursor-pointer hover:border-blue-900"
            >
              <span className="text-lg font-medium">{formatDate(checkoutDate)}</span>
              <span className="text-xs text-gray-500">
                {new Date(checkoutDate).toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>
            {showCheckoutCalendar && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                <input
                  type="date"
                  value={checkoutDate}
                  onChange={handleCheckoutChange}
                  className="w-full p-2 border rounded-lg"
                  min={checkinDate}
                />
              </div>
            )}
          </div>

          {/* Guests & Rooms */}
          <div className="w-full md:w-1/5">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">ROOMS & GUESTS</label>
            <div
              onClick={() => setShowGuestModal(true)}
              className="p-3 h-14 border border-gray-300 rounded-lg hover:border-blue-900 transition-colors bg-white w-full flex items-center cursor-pointer"
            >
              <span className="text-lg font-medium">{guestText}</span>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full mt-2 md:w-1/5">
            <button
              type="submit"
              className="w-full h-14 text-lg px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Search Hotels
            </button>
          </div>
        </div>
      </form>

      {/* Mobile Search Form - Visible when showMobileSearch is true */}
      {showMobileSearch && (
        <form onSubmit={(e) => {
          handleSearch(e);
          setShowMobileSearch(false);
        }} className="w-full md:hidden px-4">
          <div className="flex flex-col gap-4">
            {/* Header with title and close button */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-blue-950">Edit Search</h2>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Destination Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={selectedLocationId}
                onChange={(e) => {
                  const selected = destinations.find(d => d.id === e.target.value);
                  setSelectedLocationId(e.target.value);
                  setSelectedDestination(selected);
                }}
                className="p-3 h-12 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-0 transition-colors bg-white w-full text-blue-950"
              >
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Check In */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input
                type="date"
                value={checkinDate}
                onChange={handleCheckinChange}
                className="p-3 h-12 border border-gray-300 rounded-lg focus:border-blue-900 w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input
                type="date"
                value={checkoutDate}
                onChange={handleCheckoutChange}
                className="p-3 h-12 border border-gray-300 rounded-lg focus:border-blue-900 w-full"
                min={checkinDate}
              />
            </div>

            {/* Guests & Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests & Rooms</label>
              <div
                onClick={() => setShowGuestModal(true)}
                className="p-3 h-12 border border-gray-300 rounded-lg bg-white w-full flex items-center cursor-pointer"
              >
                <span className="text-blue-950">{guestText}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="flex-1 h-12 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Guest Modal - Shared between desktop and mobile */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-blue-950">Guests & Rooms</h2>
            {[
              { label: "Adults", count: adults, setter: setAdults, min: 1 },
              { label: "Children", count: children, setter: setChildren, min: 0 },
              { label: "Rooms", count: rooms, setter: setRooms, min: 1 }
            ].map(({ label, count, setter, min }) => (
              <div key={label} className="flex justify-between items-center">
                <span>{label}</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setter(Math.max(count - 1, min))}
                    className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{count}</span>
                  <button
                    type="button"
                    onClick={() => setter(count + 1)}
                    className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default SearchBar;