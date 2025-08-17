'use client';
import { useEffect, useState } from "react";
import getTourDestinations from "@/services/packages/getTourDestinations";
import TourSearchBar from "../Tour";

export default function TourSearch() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getTourDestinations();
      setData(result);
    }
    fetchData();
  }, []);

  

  return <TourSearchBar data={data} />;
}
