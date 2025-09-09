'use client';

import { useState, useMemo } from 'react';
import TourCard from './TourCard';
import FilterSidebar from './FilterSidebar';

const TourList = ({ tours }) => {
  const [filters, setFilters] = useState({
    priceRanges: [],
    durations: []
  });
  const [sortOption, setSortOption] = useState(''); 

  const priceRanges = [
    { label: "Under BDT 10,000", min: 0, max: 10000 },
    { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
    { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
    { label: "Over BDT 50,000", min: 50000, max: Infinity }
  ];

  const filteredTours = useMemo(() => {
    let result = tours.filter(tour => {
      if (filters.priceRanges.length > 0) {
        const priceRangeMatch = filters.priceRanges.some(rangeLabel => {
          const range = priceRanges.find(r => r.label === rangeLabel);
          return range && tour.price >= range.min && tour.price <= range.max;
        });
        if (!priceRangeMatch) return false;
      }

      if (filters.durations.length > 0) {
        const durationSummary = tour.summaries.find(s => s.icon_name === 'FaRegClock');
        const duration = durationSummary ? durationSummary.value : null;
        if (!duration || !filters.durations.includes(duration)) return false;
      }

      return true;
    });

    // Sorting
    if (sortOption === 'price-low-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [tours, filters, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <FilterSidebar
            tours={tours}
            filters={filters}
            setFilters={setFilters}
            priceRanges={priceRanges}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          {/* Sort dropdown */}
          <div className="flex items-center justify-between pb-2">
            <h1 className="text-blue-950 text-xl font-bold">
              <span>{filteredTours.length}</span> Packages Found
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden sm:inline-block">Sort by:</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white transition-colors"
              >
                <option value="">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Tours grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">No tours match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourList;
