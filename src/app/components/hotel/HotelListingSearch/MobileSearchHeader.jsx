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
  searchQuery,
  formatDate = (date) => {
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) || "";
  }
}) => {
  const [displayText, setDisplayText] = useState("Search destinations");
  const [isTruncated, setIsTruncated] = useState(false);

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
        setDisplayText(searchQuery.length > 30 ? `${searchQuery.substring(0, 30)}...` : searchQuery);
      } else {
        setDisplayText("Search destinations");
      }
    };

    updateDisplayText();
  }, [selectedLocationId, selectedHotelId, searchQuery, hotels, getDestinationNameById]);

  return (
    <div
      className="md:hidden p-4 bg-white rounded-xl shadow-sm cursor-pointer mb-4 border border-gray-200"
      onClick={() => setShowMobileSearch(true)}
      aria-label="Open search panel"
    >
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <LuMapPin className="text-blue-600 min-w-[20px] flex-shrink-0" />
          <div
            className={`font-bold text-blue-950 truncate ${isTruncated ? 'relative' : ''}`}
            title={displayText} 
          >
            {displayText}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMobileSearch(true);
          }}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 text-sm font-medium py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 transition-colors"
          aria-label="Edit search"
        >
          Edit
        </button>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600 min-w-[16px] flex-shrink-0" />
          <span className="truncate">
            {formatDate(checkinDate)} - {formatDate(checkoutDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaUserFriends className="text-blue-600 min-w-[16px] flex-shrink-0" />
          <span className="truncate">{guestText}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchHeader;