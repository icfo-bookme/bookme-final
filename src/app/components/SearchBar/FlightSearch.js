"use client";
import SearchField from "../../../utils/SearchField";
import SearchButton from "../../../utils/SearchButton";

const FlightSearch = () => (
  <div className="bg-white   mx-auto pb-6 rounded-lg  text-blue-950">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SearchField label="From" value="Dhaka (DAC)" />
      <SearchField label="To" value="Cox's Bazar (CXB)" />
      <SearchField label="Departure" type="date" defaultValue="2025-07-15" />
      <SearchField label="Return" type="date" defaultValue="2025-07-17" />
    </div>
    <div className="mt-6 absolute flex justify-end left-[43%]">
     
      <SearchButton>Search Flights</SearchButton>
    </div>
  </div>
);

export default FlightSearch;