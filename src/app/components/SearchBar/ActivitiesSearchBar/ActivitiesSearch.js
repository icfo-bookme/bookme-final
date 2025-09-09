'use client';
import { useEffect, useState } from "react";
import ActivitiesSearchBar from "./ActivitiesSearchBar";
import getActivitiesDestinations from "@/services/Activities/getTourDestinations";

export default function ActivitiesSearch() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getActivitiesDestinations();
      setData(result);
    }
    fetchData();
  }, []);

  return <ActivitiesSearchBar data={data} />;
}
