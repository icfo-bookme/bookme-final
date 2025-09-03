'use client';

import { useState, useMemo } from 'react';

import ActivityCard from './ActivityCard';

const ActivityList = ({ activities }) => {
  const [filters, setFilters] = useState({
    priceRanges: [],
    durations: []
  });
  const [sortOption, setSortOption] = useState(''); // 'price-low-high' | 'price-high-low' | ''

  const priceRanges = [
    { label: "Under BDT 10,000", min: 0, max: 10000 },
    { label: "BDT 10,000 - 20,000", min: 10000, max: 20000 },
    { label: "BDT 20,000 - 50,000", min: 20000, max: 50000 },
    { label: "Over BDT 50,000", min: 50000, max: Infinity }
  ];

  // Duration ranges
  const durationRanges = [
    { label: "0 to 30 minutes", min: 0, max: 30 },
    { label: "30 minutes to 1 hour", min: 30, max: 60 },
    { label: "1 to 5 hours", min: 60, max: 300 },
    { label: "5 hours to 1 day", min: 300, max: 1440 } // 1440 minutes = 24 hours
  ];

  // Function to extract duration in minutes from a duration string
  const parseDurationToMinutes = (durationString) => {
    if (!durationString) return 0;
    
    // Handle different duration formats
    if (durationString.includes('to')) {
      // For ranges like "0h 30m to 0h 45m", take the upper bound
      const parts = durationString.split('to');
      if (parts.length > 1) {
        durationString = parts[1].trim();
      }
    }
    
    let totalMinutes = 0;
    
    // Check for days first
    const dayMatch = durationString.match(/(\d+)\s*d/);
    if (dayMatch) {
      totalMinutes += parseInt(dayMatch[1]) * 1440; // 1440 minutes in a day
    }
    
    // Extract hours
    const hourMatch = durationString.match(/(\d+)\s*h/);
    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1]) * 60;
    }
    
    // Extract minutes
    const minuteMatch = durationString.match(/(\d+)\s*m/);
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1]);
    }
    
    return totalMinutes;
  };

  // Filtering and sorting
  const filteredActivities = useMemo(() => {
    let result = activities.filter(activity => {
      // Price range filter
      if (filters.priceRanges.length > 0) {
        const priceRangeMatch = filters.priceRanges.some(rangeLabel => {
          const range = priceRanges.find(r => r.label === rangeLabel);
          const activityPrice = parseFloat(activity.final_price || activity.price || 0);
          return range && activityPrice >= range.min && activityPrice <= range.max;
        });
        if (!priceRangeMatch) return false;
      }

      // Duration filter
      if (filters.durations.length > 0) {
        const durationSummary = activity.summaries.find(s => s.icon_name === 'FaRegClock');
        const durationText = durationSummary ? Object.values(durationSummary).find(
          val => typeof val === 'string' && (val.includes('h') || val.includes('m') || val.includes('d'))
        ) : null;
        
        if (!durationText) return false;
        
        const durationMinutes = parseDurationToMinutes(durationText);
        
        const durationMatch = filters.durations.some(rangeLabel => {
          const range = durationRanges.find(r => r.label === rangeLabel);
          return range && durationMinutes >= range.min && durationMinutes <= range.max;
        });
        
        if (!durationMatch) return false;
      }

      return true;
    });

    // Sorting
    if (sortOption === 'price-low-high') {
      result = [...result].sort((a, b) => {
        const aPrice = parseFloat(a.final_price || a.price || 0);
        const bPrice = parseFloat(b.final_price || b.price || 0);
        return aPrice - bPrice;
      });
    } else if (sortOption === 'price-high-low') {
      result = [...result].sort((a, b) => {
        const aPrice = parseFloat(a.final_price || a.price || 0);
        const bPrice = parseFloat(b.final_price || b.price || 0);
        return bPrice - aPrice;
      });
    }

    return result;
  }, [activities, filters, sortOption, priceRanges, durationRanges]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Update filters based on checkbox changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index >= 0) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };

  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-blue-900">Filters</h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`price-${range.label}`}
                      checked={filters.priceRanges.includes(range.label)}
                      onChange={() => handleFilterChange('priceRanges', range.label)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`price-${range.label}`} className="ml-2 text-sm text-gray-700">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Duration Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Duration</h4>
              <div className="space-y-2">
                {durationRanges.map((range) => (
                  <div key={range.label} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`duration-${range.label}`}
                      checked={filters.durations.includes(range.label)}
                      onChange={() => handleFilterChange('durations', range.label)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`duration-${range.label}`} className="ml-2 text-sm text-gray-700">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button
              onClick={() => setFilters({ priceRanges: [], durations: [] })}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          {/* Sort dropdown */}
          <div className="flex items-center justify-between pb-2">
            <h1 className="text-blue-950 text-xl font-bold">
              <span>{filteredActivities.length}</span> Activities Found
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
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <h3 className="text-lg font-medium text-gray-700">No activities match your filters</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;