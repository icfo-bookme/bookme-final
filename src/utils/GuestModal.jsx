import React from "react";

const GuestModal = ({
  adults,
  setAdults,
  childrenNumber,
  setChildren,
  rooms,
  setRooms,
  setShowGuestModal
}) => {
  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowGuestModal(false);
    }
  };

  // Prevent closing when clicking inside modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-lg mx-2"
        onClick={handleModalClick}
      >
        <h2 className="text-lg font-semibold text-blue-950">Guests & Rooms</h2>
        {[
          { label: "Adults", count: adults, setter: setAdults, min: 1 },
          { label: "Children", count: childrenNumber, setter: setChildren, min: 0 },
          { label: "Rooms", count: rooms, setter: setRooms, min: 1 }
        ].map(({ label, count, setter, min }) => (
          <div key={label} className="flex justify-between items-center">
            <span>{label}</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setter(Math.max(count - 1, min))}
                className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center hover:bg-gray-300"
              >
                −
              </button>
              <span className="w-6 text-center">{count}</span>
              <button
                type="button"
                onClick={() => setter(+count + 1)}
                className="w-8 h-8 rounded bg-gray-200 text-gray-800 text-xl flex items-center justify-center hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowGuestModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowGuestModal(false)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestModal;