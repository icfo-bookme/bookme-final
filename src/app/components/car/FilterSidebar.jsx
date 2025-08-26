'use client';

import { useState } from 'react';

const FilterSidebar = ({ 
  vehicles, 
  filters, 
  setFilters, 
  priceRanges, 
  vehicleTypes, 
  features 
}) => {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(true);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index > -1) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return { ...prev, [filterType]: currentFilters };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <h3 className="font-semibold">Price Range</h3>
          <span>{isPriceOpen ? '−' : '+'}</span>
        </div>
        {isPriceOpen && (
          <div className="mt-2 space-y-2">
            {priceRanges.map(range => (
              <div key={range.label} className="flex items-center">
                <input
                  type="checkbox"
                  id={`price-${range.label}`}
                  checked={filters.priceRanges.includes(range.label)}
                  onChange={() => toggleFilter('priceRanges', range.label)}
                  className="mr-2"
                />
                <label htmlFor={`price-${range.label}`} className="text-sm">
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Vehicle Type Filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsTypeOpen(!isTypeOpen)}
        >
          <h3 className="font-semibold">Vehicle Type</h3>
          <span>{isTypeOpen ? '−' : '+'}</span>
        </div>
        {isTypeOpen && (
          <div className="mt-2 space-y-2">
            {vehicleTypes.map(type => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={filters.vehicleTypes.includes(type)}
                  onChange={() => toggleFilter('vehicleTypes', type)}
                  className="mr-2"
                />
                <label htmlFor={`type-${type}`} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Features Filter */}
      <div className="mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
        >
          <h3 className="font-semibold">Features</h3>
          <span>{isFeaturesOpen ? '−' : '+'}</span>
        </div>
        {isFeaturesOpen && (
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {features.map(feature => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  checked={filters.features.includes(feature)}
                  onChange={() => toggleFilter('features', feature)}
                  className="mr-2"
                />
                <label htmlFor={`feature-${feature}`} className="text-sm">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Clear Filters Button */}
      <button
        onClick={() => setFilters({
          priceRanges: [],
          vehicleTypes: [],
          features: []
        })}
        className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;