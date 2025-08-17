"use client"
import React, { useState, useEffect } from "react";
import {
  FaHotel,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaPassport,
  FaShip,
} from "react-icons/fa";

import HotelSearch from "./HotelSearch";
import FlightSearch from "./FlightSearch";

import VisaSearch from "./VisaSearch";
import ShipsSearch from "./ShipsSearch";
import TourSearch from "./Tour/TourSearch";

const TravelBookingTabs = ({ searchParams }) => {
  // Initialize activeTab state from URL param or default to 'hotel'
  const [activeTab, setActiveTab] = useState(searchParams.tab || "hotel");

  // Update URL query param when activeTab changes without reload
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState(null, "", url.toString());
  }, [activeTab]);

  return (
    <div className="md:bg-white md:border border-gray-300 rounded-lg text-blue-950">
      <div className="flex lg:w-[35%] -mb-1 shadow-xl bg-white w-[80%] px-1 rounded-t-lg mx-auto md:mx-0 border-b">
        <TabButton
          active={activeTab === "hotel"}
          icon={<FaHotel />}
          onClick={() => setActiveTab("hotel")}
        >
          Hotels
        </TabButton>

        {/* Uncomment if you want Flights tab back */}
        {/* <TabButton
          active={activeTab === "flight"}
          icon={<FaPlaneDeparture />}
          onClick={() => setActiveTab("flight")}
        >
          Flights
        </TabButton> */}

        <TabButton
          active={activeTab === "ships"}
          icon={<FaShip />}
          onClick={() => setActiveTab("ships")}
        >
          Ships
        </TabButton>

        <TabButton
          active={activeTab === "visa"}
          icon={<FaPassport />}
          onClick={() => setActiveTab("visa")}
        >
          Visa
        </TabButton>

        <TabButton
          active={activeTab === "tour"}
          icon={<FaMapMarkedAlt />}
          onClick={() => setActiveTab("tour")}
        >
          Tours
        </TabButton>
      </div>

      <div className="p-4 sm:p-6 bg-white rounded-lg">
        {activeTab === "hotel" && <HotelSearch />}
        {activeTab === "flight" && <FlightSearch />}
        {activeTab === "ships" && <ShipsSearch />}
        {activeTab === "tour" && <TourSearch />}
        {activeTab === "visa" && <VisaSearch />}
      </div>
    </div>
  );
};

const TabButton = ({ active, icon, children, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm md:text-base font-medium transition-colors ${
      active
        ? "text-blue-950 border-b-2 border-blue-950"
        : "text-gray-500 hover:text-blue-800"
    }`}
    type="button"
  >
    <span className="text-lg sm:text-xl">{icon}</span>
    <span>{children}</span>
  </button>
);

export default TravelBookingTabs;
