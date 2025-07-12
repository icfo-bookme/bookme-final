"use client";
import SearchField from "./SearchField";
import SearchButton from "./SearchButton";

const TourSearch = () => (
  <div className="bg-white max-w-5xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SearchField label="Destination" value="Anywhere" />
      <SearchField label="Travel Date" type="date" defaultValue="2025-07-15" />
      <SearchField label="Duration" value="3 Days" />
    </div>
    <div className="mt-6 flex justify-end">
      <SearchButton>Find Tours</SearchButton>
    </div>
  </div>
);

export default TourSearch;