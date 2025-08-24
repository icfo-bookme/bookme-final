import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerModal = ({
  dateRange,
  handleDateChange,
  setShowDatePicker,
  onApply = () => { }
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
      className="fixed  inset-0 flex items-center justify-center z-20 p-2"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg p-2 shadow-lg  md:w-[30%] "
        onClick={handleModalClick}
      >
        <style jsx global>{`
          .react-datepicker {
            font-size: 1rem;
            border: none;
          }
          .react-datepicker__month-container {
            padding: 0.2rem;
          }
          .react-datepicker__header {
            padding: 0.2rem;
            background-color: white;
            border-bottom: 1px solid #eee;
          }
          .react-datepicker__day-name,
          .react-datepicker__day {
            width: 1.5rem;
            line-height: 1.5rem;
            margin: 0.1rem;
            font-weight: 500;
            font-size: 0.75rem;
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
            top: 6px;
          }
          .react-datepicker__month {
            margin: 0;
          }

          /* Small devices (sm: 640px and up) */
          @media (min-width: 640px) {
            .react-datepicker__month-container {
              float: left;
              width: 50%;
            }
            .react-datepicker__day-name,
            .react-datepicker__day {
              width: 1.8rem;
              line-height: 1.8rem;
              font-size: 0.8rem;
            }
          }

          /* Mobile devices */
          @media (max-width: 639px) {
            .react-datepicker {
              width: 100%;
            }
            .react-datepicker__month-container {
              width: 100%;
            }
            .react-datepicker__day-name,
            .react-datepicker__day {
              width: 3rem;
              line-height: 2rem;
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
          calendarClassName="flex flex-wrap"
          wrapperClassName="w-full"
        />

        <div className="flex justify-between mt-3 px-1">
          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof onApply === 'function') {
                onApply();
              }
              setShowDatePicker(false);
            }}
            className="px-3 py-1.5 text-sm bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Apply
          </button>

        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
