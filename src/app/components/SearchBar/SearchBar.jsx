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
    <div className=" bg-white  border border-gray-200 shadow-sm rounded-lg text-blue-950">
      {/* Tabs Navigation - Responsive layout */}
      <div className="flex lg:w-[35%] border-b">
        <TabButton
          icon={<FaHotel />}
          active={activeTab === "hotel"}
          onClick={() => setActiveTab("hotel")}
        >
          Hotel
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

      {/* Tab Content - Responsive padding */}
      <div className="p-4 sm:p-6 bg-white">
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
    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2  py-3 sm:px-4 sm:py-4 text-xs sm:text-sm md:text-base font-medium transition-colors ${
      active
        ? "text-blue-950 border-b-2 border-blue-950"
        : "text-gray-500 hover:text-blue-800"
    }`}
  >
    <span className="text-lg sm:text-xl">{icon}</span>
    <span>{children}</span>
  </button>
);

export default TravelBookingTabs;