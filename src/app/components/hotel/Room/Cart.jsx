'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from 'flowbite-react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerModal from '@/utils/DatePickerModal';

const Cart = ({ 
  cart = [], 
  isLargeScreen, 
  onClose, 
  onRemoveItem, 
  hotel_id,
  checkin: initialCheckin, 
  checkout: initialCheckout, 
  onDatesChange = () => {},
  onProceedToCheckout 
}) => {
 
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
      checkin: initialCheckin ? new Date(initialCheckin) : today,
      checkout: initialCheckout ? new Date(initialCheckout) : tomorrow
    };
  };

  const [checkin, setCheckin] = useState(getDefaultDates().checkin);
  const [checkout, setCheckout] = useState(getDefaultDates().checkout);
  const [tempCheckin, setTempCheckin] = useState(getDefaultDates().checkin);
  const [tempCheckout, setTempCheckout] = useState(getDefaultDates().checkout);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const datePickerRef = useRef(null);

  useEffect(() => {
    if (initialCheckin && initialCheckout) {
      const newCheckin = new Date(initialCheckin);
      const newCheckout = new Date(initialCheckout);

      setCheckin(newCheckin);
      setCheckout(newCheckout);
      setTempCheckin(newCheckin);
      setTempCheckout(newCheckout);
    }
  }, [initialCheckin, initialCheckout]);

  useEffect(() => {
    if (!checkin || !checkout) return;

    const bookingData = {
      cart,
      hotel_id: hotel_id,
      checkin: checkin.toISOString(),
      checkout: checkout.toISOString(),
      lastUpdated: new Date().toISOString(),
    };


    localStorage.setItem('bookingData', JSON.stringify(bookingData));
  }, [cart, checkin, checkout]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePickerModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateNights = () => {
    if (!checkin || !checkout) return 1;
    const diffTime = checkout - checkin;
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateItemTotal = (item) => {
    return item.total * calculateNights();
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleOpenDateModal = () => {
    setTempCheckin(checkin);
    setTempCheckout(checkout);
    setShowDatePickerModal(true);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setTempCheckin(start);
    setTempCheckout(end);
  };

  const applyDateChanges = () => {
    if (!tempCheckin || !tempCheckout) return;

    setCheckin(tempCheckin);
    setCheckout(tempCheckout);
    onDatesChange(tempCheckin, tempCheckout);

    const bookingData = {
      cart,
      hotel_id: hotel_id,
      checkin: tempCheckin.toISOString(),
      checkout: tempCheckout.toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    setShowDatePickerModal(false);
  };

  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) onProceedToCheckout();
  };

  return (
    <div className={`fixed inset-0  bg-black bg-opacity-50 z-50 flex ${isLargeScreen ? 'items-center justify-end' : 'items-end'}`}>
      
      {/* Date Picker Modal */}
      {showDatePickerModal && (
        <DatePickerModal
          dateRange={[tempCheckin, tempCheckout]}
          handleDateChange={handleDateChange}
          setShowDatePicker={setShowDatePickerModal}
          onApply={applyDateChanges}
        />
      )}

      {/* Cart Container */}
      <div className={`bg-white ${isLargeScreen ? 'w-96 rounded-l-lg h-[80vh] mr-0' : 'w-full rounded-t-lg max-h-[70vh]'} shadow-lg overflow-y-auto`}>
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-3 sticky top-0 flex justify-between items-center">
          <h3 className="font-bold">Your Cart ({cart.length})</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className={`overflow-y-auto ${isLargeScreen ? 'h-[calc(80vh-120px)]' : 'max-h-[60vh]'} p-3`}>
          
          {/* Stay Dates Section */}
          <div className="bg-blue-50 p-3 mb-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-blue-800">Stay Dates</h4>
              <button
                onClick={handleOpenDateModal}
                style={{ background: 'linear-gradient(90deg, #313881, #0678B4)' }}
                className="text-white rounded-md px-2 py-1 hover:text-blue-100 text-sm flex items-center"
              >
                <i className="fa-solid fa-pen mr-1 text-xs"></i> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CHECK-IN</div>
                <div className="font-semibold cursor-pointer" onClick={handleOpenDateModal}>
                  {checkin.toLocaleDateString()}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">CHECK-OUT</div>
                <div className="font-semibold cursor-pointer" onClick={handleOpenDateModal}>
                  {checkout.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-100">
              <span className="text-sm font-medium text-blue-800">Total Nights:</span>
              <span className="font-semibold">{calculateNights()}</span>
            </div>
          </div>

          {/* Cart Items */}
          {cart.map((item, index) => (
            <div key={index} className="border-b border-gray-200 py-3 flex items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-600">{item.type}</p>
                <p className="text-xs text-gray-600">{item.adults} Adults, {item.children} Children</p>
                <p className="text-xs text-gray-600">Breakfast: {item.breakfast}</p>
                <p className="text-xs mt-1">
                  <span className="font-medium">BDT {item.price}</span> × {calculateNights()} nights
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">BDT {calculateItemTotal(item)}</p>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 text-xs hover:text-red-700 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 sticky bottom-0">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg">BDT {calculateTotal()}</span>
          </div>
          <Button
            onClick={handleProceedToCheckout}
            style={{ background: 'linear-gradient(90deg, #313881, #0678B4)' }}
            className="w-full py-2 text-white rounded hover:opacity-90 transition-colors"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
