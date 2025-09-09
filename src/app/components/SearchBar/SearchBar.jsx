import React from "react";
import {
  FaHotel,
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaPassport,
  FaShip,
  FaHiking,
  FaCar, 
} from "react-icons/fa";

import HotelSearch from "./Hotels/HotelSearch";
import VisaSearch from "./Visa/VisaSearch";
import TourSearch from "./Tour/TourSearch";
import ClientSideTabs from "./ClientSideTabs";
import ActivitiesSearch from "./ActivitiesSearchBar/ActivitiesSearch";
import CarRentalSearch from "./CarRental/CarRentalSearch"; 
import ShipsSearch from "./Ship/ShipsSearch";

const TravelBookingTabs = ({ searchParams }) => {
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