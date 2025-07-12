"use client";
import React, { useState } from "react";
import {
  FaHotel,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaPassport,
} from "react-icons/fa";
import HotelSearch from "./HotelSearch";
import FlightSearch from "./FlightSearch";
import TourSearch from "./TourSearch";
import VisaSearch from "./VisaSearch";

const TravelBookingTabs = () => {
  const [activeTab, setActiveTab] = useState("hotel");

  return (
    <div className="max-w-full bg-white shadow-lg rounded-lg text-blue-950">
      {/* Tabs Navigation */}
      <div className="flex border-b text-center">
        <TabButton
          icon={<FaHotel />}
          active={activeTab === "hotel"}
          onClick={() => setActiveTab("hotel")}
        >
          Hotel
        </TabButton>
        <TabButton
          icon={<FaPlaneDeparture />}
          active={activeTab === "flight"}
          onClick={() => setActiveTab("flight")}
        >
          Flight
        </TabButton>
        <TabButton
          icon={<FaMapMarkedAlt />}
          active={activeTab === "tour"}
          onClick={() => setActiveTab("tour")}
        >
          Tour
        </TabButton>
        <TabButton
          icon={<FaPassport />}
          active={activeTab === "visa"}
          onClick={() => setActiveTab("visa")}
        >
          Visa
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white">
        {activeTab === "hotel" && <HotelSearch />}
        {activeTab === "flight" && <FlightSearch />}
        {activeTab === "tour" && <TourSearch />}
        {activeTab === "visa" && <VisaSearch />}
      </div>
    </div>
  );
};

const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-base font-semibold transition-colors ${
      active
        ? "text-blue-950 border-b-2 border-blue-950"
        : "text-gray-500 hover:text-blue-800"
    }`}
  >
    <span className="text-lg">{icon}</span>
    {children}
  </button>
);

export default TravelBookingTabs;