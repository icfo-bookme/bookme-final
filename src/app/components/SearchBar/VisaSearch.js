"use client";
import { useState } from "react";
import SearchField from "../../../utils/SearchField";
import SearchButton from "../../../utils/SearchButton";

const VisaSearch = () => {
  const [nationality, setNationality] = useState("Bangladeshi");
  const [destination, setDestination] = useState("Select Country");
  const [visaType, setVisaType] = useState("Tourist Visa");

  const handleSearch = () => {
    // Add your search logic here
    console.log("Searching with:", { nationality, destination, visaType });
    // You would typically call an API or perform some action here
  };

  return (
    <div className="bg-white max-w-5xl mx-auto p-6 rounded-lg ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <SearchField
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          options={["Bangladeshi", "Indian", "Pakistani", "Nepalese"]}
        />
        <SearchField
          label="Destination Country"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          options={[
            "Select Country",
            "USA",
            "UK",
            "Canada",
            "Australia",
            "Germany",
          ]}
        />
        <SearchField
          label="Visa Type"
          value={visaType}
          onChange={(e) => setVisaType(e.target.value)}
          options={[
            "Tourist Visa",
            "Business Visa",
            "Student Visa",
            "Work Visa",
          ]}
        />
        <SearchButton onClick={handleSearch}>
          <span className="sr-only">Search</span>
          <span aria-hidden="true">🔍Search</span>
        </SearchButton>
      </div>
      <div className="mt-6 flex justify-end">
        {/* You can add additional buttons or links here if needed */}
      </div>
    </div>
  );
};

export default VisaSearch;