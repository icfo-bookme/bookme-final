'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import getDestination from "@/services/hotel/getDestination";
import getAllHotels from "@/services/hotel/getAllHotels";


import ErrorDisplay from "./Hotels/ErrorDisplay";
import SearchForm from "./Hotels/SearchForm";
import LoadingSpinner from "./Hotels/LoadingSpinner";
import { set } from "date-fns";


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

const HotelSearch = () => {
  
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    const destinationsCacheKey = 'destinations-cache';
    const hotelsCacheKey = 'hotels-cache';
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

    setIsLoading(true);
    setError(null);

    try {
      // Check destinations cache first
      const cachedDestinations = localStorage.getItem(destinationsCacheKey);
      if (cachedDestinations) {
        const { data, timestamp } = JSON.parse(cachedDestinations);
        if (Date.now() - timestamp < cacheExpiry) {
          setDestinations(data);
        }
      }

      // Check hotels cache
      const cachedHotels = localStorage.getItem(hotelsCacheKey);
      if (cachedHotels) {
        const { data, timestamp } = JSON.parse(cachedHotels);
        if (Date.now() - timestamp < cacheExpiry) {
          setHotels(data);
        }
      }

      // Fetch fresh data if cache is expired or doesn't exist
      const [destinationsData, hotelsData] = await Promise.all([
        getDestination(),
        getAllHotels()
      ]);

      // Update caches
      localStorage.setItem(destinationsCacheKey, JSON.stringify({
        data: destinationsData,
        timestamp: Date.now()
      }));

      localStorage.setItem(hotelsCacheKey, JSON.stringify({
        data: hotelsData,
        timestamp: Date.now()
      }));

      setDestinations(destinationsData);
      setHotels(hotelsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Failed to load data. Please try again.");

      // Fallback to default destinations
      if (destinations.length === 0) {
        setDestinations(DEFAULT_DESTINATIONS);
      }

      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    fetchData();
  };

  if (error && retryCount >= 3) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SearchForm 
      destinations={destinations} 
      hotels={hotels} 
      defaultDestination={destinations[0]}
    />
  );
};

export default HotelSearch;