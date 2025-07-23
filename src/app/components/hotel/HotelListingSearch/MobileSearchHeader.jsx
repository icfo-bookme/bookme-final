import React from "react";

const MobileSearchHeader = ({
  selectedLocationId,
  checkinDate,
  checkoutDate,
  guestText,
  getDestinationNameById,
  setShowMobileSearch,
  formatMobileDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}) => {
  return (
    <div className='grid grid-cols-5 md:hidden mb-4 px-4'>
      <div className='col-span-3'>
        <h1 className="text-lg font-semibold text-blue-950 truncate">
          {getDestinationNameById(selectedLocationId)}
        </h1>
        <p className="text-sm text-gray-600">
          {formatMobileDate(checkinDate)} - {formatMobileDate(checkoutDate)}, {guestText}
        </p>
      </div>
      <div className='col-span-2 flex justify-end items-center'>
        <button
          onClick={() => setShowMobileSearch(true)}
          className="bg-yellow-500 text-blue-950 px-4 text-sm font-bold py-2 rounded-lg"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default MobileSearchHeader;