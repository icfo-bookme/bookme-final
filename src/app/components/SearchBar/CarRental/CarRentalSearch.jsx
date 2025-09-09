'use client';
import { useEffect, useState } from "react";
import getDestination from "@/services/Car/getDestination";
import TourSearchBar from "../Tour/Tour";
import CarRentalSearchBar from "./CarRental";

export default function CarRentalSearch() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getDestination();
      setData(result);
    }
    fetchData();
  }, []);

  return <CarRentalSearchBar locationsData={data} />;
}
