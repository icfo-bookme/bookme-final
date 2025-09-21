import React from "react";
import {
  FaHotel,
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

const TravelBookingTabs = async ({ searchParams }) => {
  const params = await searchParams;
  const initialTab = params?.tab || "hotel";

  return (
    <div className="md:bg-white md:border border-gray-300 rounded-lg text-blue-950">
      <ClientSideTabs
        initialTab={initialTab}
        components={{
          hotel: <HotelSearch />,
          ships: <ShipsSearch />,
          tour: <TourSearch />,
          visa: <VisaSearch />,
          activities: <ActivitiesSearch />,
          carRental: <CarRentalSearch />,
        }}
        icons={{
          hotel: <FaHotel />,
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
