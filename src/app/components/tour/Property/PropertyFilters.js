"use client";

import { useState } from "react";
import { RangeSlider } from "flowbite-react";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import PropertySearch from "./PropertySearch";

export default function PropertyFilters({
  searchTerm,
  setSearchTerm,
  propertyNames,
  setCurrentPage,
  price,
  setPrice,
  sortOption,
  setSortOption
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSortChange = (e) => {
    const previousScrollPosition = window.scrollY;
    setSortOption(e.target.value);
    setCurrentPage(1);
    setTimeout(() => {
      window.scrollTo(0, previousScrollPosition);
    }, 0);
  };

  return (
    <div className={`mb-8 rounded-lg shadow md:w-[90%] border border-gray-300 mx-auto bg-gray-50 p-5  ${isSearchFocused ? 'lg:hidden  absolute inset-0 h-[20rem] pt-20 px-4 pb-4 z-20' : ''}`}>
      <div className="flex flex-col md:flex-row bg-white gap-6 mb-6">
        <PropertySearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          propertyNames={propertyNames}
          setCurrentPage={setCurrentPage}
          onFocusChange={setIsSearchFocused}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:w-2/3 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-700">
              <FaFilter className="h-5 w-5" />
              <span className="text-sm font-medium">Price Range</span>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <RangeSlider
                id="default-range"
                min={0}
                max={10000}
                step={500}
                value={price}
                onChange={(e) => {
                  const previousScrollPosition = window.scrollY;
                  setPrice(Number(e.target.value));
                  setTimeout(() => {
                    window.scrollTo(0, previousScrollPosition);
                  }, 0);
                }}
                className="w-full mt-[-18px] appearance-none h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-blue-700 whitespace-nowrap min-w-[90px]">
                {parseInt(price).toLocaleString()}
                {parseInt(price) > 9500 ? "+" : ""} TK
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-gray-700">
            <FaSortAmountDown className="h-4 w-4" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>
          <select
            className="w-full border border-gray-300 rounded-lg text-gray-700 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white shadow-sm"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="1" disabled hidden>Select option</option>
            <option value="2">Price: Low to High</option>
            <option value="3">Price: High to Low</option>
            <option value="4">Most Popular</option>
          </select>
        </div>
      </div>
    </div>
  );
}