"use client";
import { useState } from "react";

const FilterSidebar = () => {
  const [price, setPrice] = useState(1000); // Default price value

  return (
    <div className="col-span-1 xl:col-span-3 w-full  p-4  rounded-lg ">
      {/* Heading */}

      {/* Filter Controls in One Row */}
      <div className="flex flex-wrap justify-between items-center gap-4 ">
        {/* Price Range */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <div className="flex justify-between items-center ">
            <h4 className="text-lg text-[#00026E] font-semibold">
              Filter by :{" "}
            </h4>
          </div>
          <h4 className="text-sm hidden md:block font-medium text-[#00026E]">
            Price Range:
          </h4>
          <span className="text-sm font-medium text-blue-600">
            {parseInt(price).toLocaleString()} BDT
          </span>
          <input
            className="w-40 appearance-none h-2 rounded-lg bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              WebkitAppearance: "none",
            }}
          />
        </div>

        {/* Range Input */}

        {/* Sort Listing */}
        <div className="flex items-center gap-2 justify-center mx-auto  lg:mx-0 ">
          <h4 className="text-sm   font-medium text-[#00026E]">
            Sort Listing:
          </h4>
          <select className="w-40 border border-gray-300 rounded-md text-[#00026E] px-3 py-1.5 text-sm focus:ring-blue-400 focus:border-blue-400">
            <option value="1">Popularity</option>
            <option value="2">Low to High</option>
            <option value="3">High to Low</option>
          </select>
        </div>
      </div>

      {/* Custom Styling for Range Input */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background-color: #1e40af; /* Blue-600 */
          cursor: pointer;
          border: 2px solid #93c5fd; /* Light Blue Border */
        }

        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background-color: #1e40af; /* Blue-600 */
          cursor: pointer;
          border: 2px solid #93c5fd; /* Light Blue Border */
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;
