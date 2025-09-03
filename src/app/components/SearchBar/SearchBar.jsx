import React from "react";
import {
  FaHotel,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaPassport,
  FaShip,
  FaHiking,
  FaCar, // added for car rental
} from "react-icons/fa";

import HotelSearch from "./Hotels/HotelSearch";
// import FlightSearch from "./FlightSearch";
import VisaSearch from "./VisaSearch";
import ShipsSearch from "./ShipsSearch";
import TourSearch from "./Tour/TourSearch";
import ClientSideTabs from "./ClientSideTabs";
import ActivitiesSearch from "./ActivitiesSearchBar/ActivitiesSearch";
import CarRentalSearch from "./CarRental/CarRentalSearch"; // import the car rental component

const TravelBookingTabs = ({ searchParams }) => {
  // Pass initial tab value to client component
  const initialTab = searchParams.tab || "hotel";

  return (
    <div className="md:bg-white md:border border-gray-300 rounded-lg text-blue-950">
      <ClientSideTabs
        initialTab={initialTab}
        components={{
          hotel: <HotelSearch />,
          // flight: <FlightSearch />,
          ships: <ShipsSearch />,
          tour: <TourSearch />,
          visa: <VisaSearch />,
          activities: <ActivitiesSearch />,
          carRental: <CarRentalSearch />, 
        }}
        icons={{
          hotel: <FaHotel />,
          // flight: <FaPlaneDeparture />,
          ships: <FaShip />,
          tour: <FaMapMarkedAlt />,
          visa: <FaPassport />,
          activities: <FaHiking />,
          carRental: <FaCar />, 
        }}
      />
    </div>
  );
};

export default TravelBookingTabs;