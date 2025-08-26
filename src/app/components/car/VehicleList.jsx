'use client';

import { useState, useMemo } from 'react';
import FilterSidebar from './FilterSidebar';
import VehicleCard from './VehicleCard';
import ActivityCard from '../Activities/ActivityCard';

const VehicleList = ({ vehicles }) => {



  return (
    <div className="px-4 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className='col-span-1'>

        </div>
        <div className="col-span-3 gap-6">
            
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
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
  );
};

export default VehicleList;