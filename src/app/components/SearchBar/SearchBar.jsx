import React from "react";
import Link from "next/link";
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
  const activeTab = searchParams.tab || "hotel";

  return (
    <div className="md:bg-white md:border border-gray-300 rounded-lg text-blue-950">
      <div className="flex lg:w-[35%] -mb-1 shadow-xl bg-white w-[80%] px-1 rounded-t-lg mx-auto md:mx-0 border-b">
        <TabButton
          active={activeTab === "hotel"}
          icon={<FaHotel />}
          href="?tab=hotel"
        >
          Hotels
        </TabButton>

        <TabButton
          active={activeTab === "ships"}
          icon={<FaShip />}
          href="?tab=ships"
        >
          Ships
        </TabButton>

        <TabButton
          active={activeTab === "visa"}
          icon={<FaPassport />}
          href="?tab=visa"
        >
          Visa
        </TabButton>

        <TabButton
          active={activeTab === "tour"}
          icon={<FaMapMarkedAlt />}
          href="?tab=tour"
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

const TabButton = ({ active, icon, children, href }) => (
  <Link
    href={href}
    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm md:text-base font-medium transition-colors ${
      active
        ? "text-blue-950 border-b-2 border-blue-950"
        : "text-gray-500 hover:text-blue-800"
    }`}
  >
    <span className="text-lg sm:text-xl">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default TravelBookingTabs;