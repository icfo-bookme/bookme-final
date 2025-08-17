import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";

const MobileSearchHeader = ({
  selectedLocationId,
  selectedHotelId,
  checkinDate,
  checkoutDate,
  guestText,
  getDestinationNameById,
  setShowMobileSearch,
  destinations,
  hotels,
  searchQuery, // Add searchQuery prop to track changes
  formatDate = (date) => {
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) || "";
  }
}) => {
  const [displayText, setDisplayText] = useState("Search destinations");

  // Update display text whenever dependencies change
  useEffect(() => {
    const updateDisplayText = () => {
      if (selectedHotelId) {
        const selectedHotel = hotels?.find(h => String(h.id) === String(selectedHotelId));
        setDisplayText(selectedHotel 
          ? `${selectedHotel.name}, ${selectedHotel.city}`
          : "Select Hotel");
      } else if (selectedLocationId) {
        setDisplayText(getDestinationNameById(selectedLocationId));
      } else if (searchQuery) {
        setDisplayText(searchQuery);
      } else {
        setDisplayText("Search destinations");
      }
    };

    updateDisplayText();
  }, [selectedLocationId, selectedHotelId, searchQuery, hotels, getDestinationNameById]);

  return (
    <div 
      className="md:hidden p-4 bg-white rounded-xl shadow-sm cursor-pointer mb-4"
      onClick={() => setShowMobileSearch(true)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <LuMapPin className="text-blue-600 min-w-[20px]" />
          <div className="font-bold text-blue-950 truncate">
            {displayText}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMobileSearch(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 px-3 text-sm font-bold py-1.5 rounded-lg whitespace-nowrap ml-2"
        >
          Edit
        </button>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600 min-w-[16px]" />
          <span>
            {formatDate(checkinDate)} - {formatDate(checkoutDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUserFriends className="text-blue-600 min-w-[16px]" />
          <span>{guestText}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchHeader;