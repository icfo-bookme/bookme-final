import React from "react";
import getDestination from "@/services/hotel/getDestination";
import getAllHotels from "@/services/hotel/getAllHotels";

import ErrorDisplay from "./ErrorDisplay";
import SearchForm from "./SearchForm";

const DEFAULT_DESTINATIONS = [
  {
    id: "default-1",
    name: "Dhaka",
    country: "Bangladesh"
  },
  {
    id: "default-2",
    name: "Cox's Bazar",
    country: "Bangladesh"
  },
  {
    id: "default-3",
    name: "Chittagong",
    country: "Bangladesh"
  },
];

const HotelSearch = async () => {
  try {
   
    const [destinationsData, hotelsData] = await Promise.all([
      getDestination(),
      getAllHotels(),
    ]);

    return (
      <SearchForm
        destinations={destinationsData && destinationsData.length > 0 ? destinationsData : DEFAULT_DESTINATIONS}
        hotels={hotelsData}
        defaultDestination={
          destinationsData && destinationsData.length > 0
            ? destinationsData[0]
            : DEFAULT_DESTINATIONS[0]
        }
      />
    );
  } catch (error) {
    console.error("Failed to load data:", error);

    return (
      <ErrorDisplay
        error="Failed to load data. Please try again."
        onRetry={() => {}} 
      />
    );
  }
};

export default HotelSearch;
