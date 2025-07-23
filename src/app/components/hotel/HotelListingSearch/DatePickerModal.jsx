import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerModal = ({
  dateRange,
  handleDateChange,
  setShowDatePicker
}) => {
  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDatePicker(false);
    }
  };

  // Prevent closing when clicking inside modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed md:mt-0 inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-4 shadow-lg mx-2 w-full max-w-[20rem] md:max-w-[33rem]"
        onClick={handleModalClick}
      >
        <style jsx global>{`
          .react-datepicker {
            font-size: 0.85rem;
            border: none;
          }
          .react-datepicker__month-container {
            padding: 0.3rem;
          }
          .react-datepicker__header {
            padding: 0.3rem;
            background-color: white;
            border-bottom: 1px solid #eee;
          }
          .react-datepicker__day-name,
          .react-datepicker__day {
            width: 1.7rem;
            line-height: 1.7rem;
            margin: 0.1rem;
            font-weight: 500;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--in-selecting-range,
          .react-datepicker__day--in-range {
            background-color: #1e3a8a;
            color: white;
          }
          .react-datepicker__day--keyboard-selected {
            background-color: #3b82f6;
          }
          .react-datepicker__navigation {
            top: 8px;
          }
          @media (max-width: 768px) {
            .react-datepicker {
              font-size: 0.9rem;
            }
            .react-datepicker__month-container {
              padding: 0.5rem;
            }
            .react-datepicker__day-name,
            .react-datepicker__day {
              width: 2.1rem;
              line-height: 1.5rem;
            }
            .react-datepicker__navigation {
              top: 7px;
            }
            .react-datepicker__month {
              margin: 0;
            }
            .react-datepicker__header {
              padding: 0.5rem;
            }
          }
        `}</style>

        <DatePicker
          selectsRange={true}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={handleDateChange}
          minDate={new Date()}
          monthsShown={2}
          inline
          className="border-0"
          calendarClassName="w-full"
          wrapperClassName="w-full"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;