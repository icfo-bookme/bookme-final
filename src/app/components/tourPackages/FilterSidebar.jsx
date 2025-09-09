'use client';

import { useState } from 'react';
import { FiFilter } from 'react-icons/fi';

const PRICE_RANGES = [
  { label: "Under BDT 10,000", min: 0, max: 10000 },
  { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
  { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
  { label: "Over BDT 50,000", min: 50000, max: Infinity }
];

const FilterSidebar = ({ tours, filters, setFilters }) => {
  const [showModal, setShowModal] = useState(false);

  const durations = [...new Set(tours.map(tour => {
    const durationSummary = tour.summaries?.find(s => s.icon_name === 'FaRegClock');
    return durationSummary ? durationSummary.value : null;
  }).filter(Boolean))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const sidebarContent = (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
      <h3 className="font-bold text-lg mb-2 text-blue-900">Filters</h3>
      <hr />
      {/* Price Range */}
      <div className="my-3 ">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Price Range</h4>
        <div className="space-y-2 ml-2">
          {PRICE_RANGES.map((range, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.priceRanges.includes(range.label)}
                onChange={() => handleFilterChange('priceRanges', range.label)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      <hr />
      {/* Duration */}
      <div className="my-3">
        <h4 className="font-bold text-sm mb-2 text-blue-900">Duration</h4>
        <div className="space-y-2 ml-2">
          {durations.map((duration, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.durations.includes(duration)}
                onChange={() => handleFilterChange('durations', duration)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setFilters({ priceRanges: [], durations: [] })}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Reset Filters
      </button>
    </div>
  );

  const handleApplyFilters = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-16">
        {sidebarContent}
      </div>

      {/* Floating Button for Mobile */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiFilter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-h-[90vh] overflow-y-auto w-11/12 sm:w-3/4 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Filter Content */}
            {sidebarContent}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
