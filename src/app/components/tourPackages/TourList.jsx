'use client';

import { useState } from 'react';
import TourCard from './TourCard';
import FilterSidebar from './FilterSidebar';

const TourList = ({ tours }) => {
  const [filters, setFilters] = useState({
    priceRanges: [],
    durations: []
  });

  const priceRanges = [
  { label: "Under BDT 10,000", min: 0, max: 10000 },
  { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
  { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
  { label: "Over BDT 50,000", min: 50000, max: Infinity }
];


  const filteredTours = tours.filter(tour => {
    // Price range filter
    if (filters.priceRanges.length > 0) {
      const priceRangeMatch = filters.priceRanges.some(rangeLabel => {
        const range = priceRanges.find(r => r.label === rangeLabel);
        return range && tour.price >= range.min && tour.price <= range.max;
      });
      if (!priceRangeMatch) return false;
    }

    // Duration filter
    if (filters.durations.length > 0) {
      const durationSummary = tour.summaries.find(s => s.icon_name === 'FaRegClock');
      const duration = durationSummary ? durationSummary.value : null;
      if (!duration || !filters.durations.includes(duration)) return false;
    }

    return true;
  });

  return (
    <div className="px-4 md:py-4 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 ">
          <FilterSidebar 
            tours={tours} 
            filters={filters} 
            setFilters={setFilters}
            priceRanges={priceRanges} // Pass as prop
          />
        </div>
        <div className="grid col-span-1 md:col-span-3 grid-cols-1 gap-6">
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
  );
};

export default TourList;