'use client';

import { useState, useMemo } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, models, brands }) => {
  const [filters, setFilters] = useState({
    search: '',
    seats: [],
    brands: [],
    models: []
  });
  
  const [showModal, setShowModal] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Process seat options
  const seatOptions = [
    { value: '2', label: '2 Seats' },
    { value: '3-5', label: '3-5 Seats' },
    { value: '6-8', label: '6-8 Seats' },
    { value: '9+', label: '9+ Seats' }
  ];

  // Create a map of model IDs to model names for easy lookup
  const modelMap = useMemo(() => {
    const map = {};
    if (models && Array.isArray(models)) {
      models.forEach(model => {
        map[model.id] = model.model_name;
      });
    }
    return map;
  }, [models]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      if (filters.search && !vehicle.property_name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Seat filter
      if (filters.seats.length > 0) {
        const seatingSummary = vehicle.summaries?.find(s =>
          s.name.toLowerCase().includes('seat') || s.name === 'Seating Capacity'
        );

        let hasMatchingSeats = false;

        if (seatingSummary) {
          const valueKey = Object.keys(seatingSummary).find(key =>
            key !== 'name' && key !== 'icon_name' && key !== 'icon_import'
          );

          if (valueKey) {
            const seatCount = parseInt(seatingSummary[valueKey]);

            if (!isNaN(seatCount)) {
              hasMatchingSeats = filters.seats.some(seatFilter => {
                if (seatFilter === '2') return seatCount === 2;
                if (seatFilter === '3-5') return seatCount >= 3 && seatCount <= 5;
                if (seatFilter === '6-8') return seatCount >= 6 && seatCount <= 8;
                if (seatFilter === '9+') return seatCount >= 9;
                return false;
              });
            }
          }
        }

        if (!hasMatchingSeats) return false;
      }

      // Brand filter
      if (filters.brands.length > 0) {
        const vehicleBrandId = vehicle.brand?.brand_id?.toString();
        if (!vehicleBrandId || !filters.brands.includes(vehicleBrandId)) {
          return false;
        }
      }

      // Model filter
      if (filters.models.length > 0) {
        const vehicleModelId = vehicle.brand?.model_id?.toString();
        if (!vehicleModelId || !filters.models.includes(vehicleModelId)) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, filters]);

  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setTempFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handleTempCheckboxChange = (filterType, value) => {
    setTempFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      seats: [],
      brands: [],
      models: []
    });
    setTempFilters({
      search: '',
      seats: [],
      brands: [],
      models: []
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowModal(false);
  };

  const openModal = () => {
    setTempFilters(filters);
    setShowModal(true);
  };

  // Check if any filter is active
  const isFilterActive = filters.search ||
    filters.seats.length > 0 ||
    filters.brands.length > 0 ||
    filters.models.length > 0;

  // Filter sidebar component
  const FilterSidebar = ({ isModal = false, filtersToUse, onCheckboxChange }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${!isModal ? 'sticky top-16 h-[calc(100vh-120px)] overflow-y-auto' : 'h-full'}`}>
      
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-blue-950 md:block hidden font-bold">Filter</h1>
        {isFilterActive && !isModal && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block font-bold text-blue-950 mb-1">Search by car name</label>
        <input
          type="text"
          placeholder="Search vehicles..."
          value={filtersToUse.search}
          onChange={(e) => isModal ? setTempFilters({...tempFilters, search: e.target.value}) : handleSearchChange(e.target.value)}
          className="w-full p-2 border-2 rounded-md ring-blue-500 border-blue-500"
        />
      </div>

      {/* Seat Filter */}
      <div className="mb-6">
        <label className="block font-bold text-blue-950 mb-2">Seating capacity</label>
        <div className="space-y-2">
          {seatOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filtersToUse.seats.includes(option.value)}
                onChange={() => isModal ? handleTempCheckboxChange('seats', option.value) : handleCheckboxChange('seats', option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block font-bold text-blue-950 mb-2">Brands</label>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {brands && brands.map(brand => (
            <label key={brand.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filtersToUse.brands.includes(brand.id.toString())}
                onChange={() => isModal ? handleTempCheckboxChange('brands', brand.id.toString()) : handleCheckboxChange('brands', brand.id.toString())}
                className="h-4 w-4 text-blue-600 ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Model Filter */}
      <div className="mb-6">
        <label className="block font-bold text-blue-950 mb-2">Models</label>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {models && models.map(model => (
            <label key={model.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filtersToUse.models.includes(model.id.toString())}
                onChange={() => isModal ? handleTempCheckboxChange('models', model.id.toString()) : handleCheckboxChange('models', model.id.toString())}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{model.model_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600 border-t pt-3">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>
    </div>
  );

  return (
    <div className="px-4 md:py-4">
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FiFilter size={18} />
          <span className="text-blue-100">Filters</span>
          {isFilterActive && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col md:hidden">
          <div className="bg-white rounded-t-lg mt-14 flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg text-blue-950 font-bold">Filters</h2>
              <button onClick={() => setShowModal(false)}>
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar isModal={true} filtersToUse={tempFilters} onCheckboxChange={handleTempCheckboxChange} />
            </div>
            
            {/* Fixed Bottom Buttons */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden md:block col-span-1">
          <FilterSidebar filtersToUse={filters} onCheckboxChange={handleCheckboxChange} />
        </div>

        {/* Vehicle List */}
        <div className="col-span-1 md:col-span-3">
          {/* Active Filters Bar */}
          {isFilterActive && (
            <div className="bg-blue-50 p-3 rounded-lg mb-6 flex flex-wrap items-center">
              <span className="text-sm text-gray-700 mr-2">Active filters:</span>
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                  Search: {filters.search}
                  <button 
                    onClick={() => handleSearchChange('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.seats.map(seat => (
                <span key={seat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                  {seatOptions.find(o => o.value === seat)?.label}
                  <button 
                    onClick={() => handleCheckboxChange('seats', seat)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.brands.map(brandId => {
                const brand = brands.find(b => b.id.toString() === brandId);
                return brand ? (
                  <span key={brandId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                    Brand: {brand.name}
                    <button 
                      onClick={() => handleCheckboxChange('brands', brandId)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              {filters.models.map(modelId => {
                const model = models.find(m => m.id.toString() === modelId);
                return model ? (
                  <span key={modelId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                    Model: {model.model_name}
                    <button 
                      onClick={() => handleCheckboxChange('models', modelId)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}

         {filteredVehicles.length > 0 ? (
            <div className="space-y-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">No vehicles match your filters</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
              <button
                onClick={clearFilters}
                className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleList;