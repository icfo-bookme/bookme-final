'use client';

import { IoLocationOutline } from "react-icons/io5";
import { MdEventSeat } from "react-icons/md";
import { FaCertificate } from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
import { BsFillFuelPumpFill } from "react-icons/bs";
import Image from 'next/image';
import Link from 'next/link';

const VehicleCard = ({ vehicle }) => {

  const slugify = (str) =>
    str
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, '-')
      ?.replace(/[^\w\-]+/g, '')
      ?.replace(/\-\-+/g, '-') || '';

  // Function to render the appropriate icon based on icon_name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'MdEventSeat':
        return <MdEventSeat className="text-yellow-800 text-sm" />;
      case 'FaCertificate':
        return <FaCertificate className="text-yellow-800 text-sm" />;
      case 'IoSpeedometer':
        return <IoSpeedometer className="text-yellow-800 text-sm" />;
      case 'BsFillFuelPumpFill':
        return <BsFillFuelPumpFill className="text-yellow-800 text-sm" />;
      default:
        return <FaCertificate className="text-yellow-800 text-sm" />;
    }
  };


  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('en-IN', {
      maximumFractionDigits: 0
    });
  };


  const basePrice = vehicle.price_upto_4_hours && vehicle.kilometer_price 
    ? parseFloat(vehicle.price_upto_4_hours) * 4 + parseFloat(vehicle.kilometer_price) * 40 
    : 0;

  // Process summaries to prioritize seating capacity and format values
  const processSummaries = () => {
    if (!vehicle.summaries || !Array.isArray(vehicle.summaries) || vehicle.summaries.length === 0) return [];
    
    // Create a copy of the summaries array and filter out null/undefined items
    const summaries = [...vehicle.summaries].filter(s => s && typeof s === 'object');
    
    // Find and prioritize seating capacity
    const seatingIndex = summaries.findIndex(s => 
      s?.name && (s.name.toLowerCase().includes('seat') || s.name === 'Seating Capacity')
    );
    
    if (seatingIndex > -1) {
      // Remove seating from current position and add to beginning
      const seatingSummary = summaries.splice(seatingIndex, 1)[0];
      summaries.unshift(seatingSummary);
    }
    
    // Format the display for each summary
    return summaries.map(summary => {
      // Check if the summary has a value property
      const valueKey = Object.keys(summary).find(key => 
        key !== 'name' && key !== 'icon_name' && key !== 'icon_import'
      );
      
      if (valueKey) {
        const value = summary[valueKey];
        
        // For seating capacity, always show the value
        if (summary.name && (summary.name.toLowerCase().includes('seat') || summary.name === 'Seating Capacity')) {
          return {
            ...summary,
            displayText: value?.toString() || "",
            showFeature: true
          };
        }
        // For other features, only show if value is "Yes"
        else if (value === "Yes" || value === true) {
          return {
            ...summary,
            displayText: "",
            showFeature: true
          };
        }
        // Don't show features with value not "Yes"
        else {
          return {
            ...summary,
            showFeature: false
          };
        }
      }
      
      // Default case if no value key found
      return {
        ...summary,
        displayText: "",
        showFeature: true
      };
    }).filter(summary => summary.showFeature); 
  };

  const processedSummaries = processSummaries();

  return (
    <Link
      href={`/${slugify(vehicle.property_name)}/${vehicle.id}`}
      className="block"
    >
      <div className="group mb-5 relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200 bg-white hover:border-blue-100">
        {/* Vehicle Image */}
        <div className="relative w-full md:w-2/5 h-[14rem] rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/storage/${vehicle.image}`}
            alt={vehicle.property_name || 'Vehicle'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* Vehicle Details */}
        <div className="flex flex-col justify-between w-full md:w-3/5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-blue-900 mb-1">{vehicle.property_name || 'Unnamed Vehicle'}</h3>
            </div>

            {/* Vehicle Summary */}
            <div className="flex flex-wrap gap-2 mb-4 mt-3">
              {processedSummaries.length > 0 ? (
                processedSummaries.slice(0, 4).map((summary, i) => (
                  <span
                    key={i}
                    className="flex items-center text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <div className="mr-2">
                      {renderIcon(summary.icon_name)}
                    </div>
                    <span className="font-medium">
                      {summary.name || 'Feature'}
                      {summary.displayText && `: ${summary.displayText}`}
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No features listed</span>
              )}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex  flex-row items-start md:items-center justify-between pt-3 border-t border-gray-100">
            <button
              style={{
                background: "linear-gradient(90deg, #313881, #0678B4)",
              }}
              className="mt-8  md:mt-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Rent Now
              <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </button>

            <div className="text-right mt-3 md:mt-0">
              <span className="text-xs text-gray-500 block">Starting From:</span>
              <div className="flex items-end justify-end gap-2">
                {basePrice > 0 ? (
                  <p className="text-xl font-bold text-blue-800">
                    {formatPrice(basePrice)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Price on request</p>
                )}
              </div>
              {basePrice > 0 ? (
                <>
                  <p className="text-xs text-gray-500 mt-1">for 4 hours and 40 km</p>
                  {vehicle.kilometer_price > 0 && (
                    <p className="text-xs font-bold text-blue-900">
                      {formatPrice(vehicle.price_upto_4_hours)} per hour, {formatPrice(vehicle.kilometer_price)} per km
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;