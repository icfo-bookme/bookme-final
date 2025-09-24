'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'flowbite-react';
import { useUser } from '@/lib/UserContext';

export default function BookingReviewPage() {
  const [bookingData, setBookingData] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: '',
  });
  const { user } = useUser();
  const router = useRouter();

  // Load booking data from localStorage and auto-fill user info
  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  // Auto-fill guest information when user data is available (as default values)
  useEffect(() => {
    if (user) {
      setGuestInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Calculate total nights
  const calculateNights = () => {
    if (!bookingData) return 0;
    const checkinDate = new Date(bookingData.checkin);
    const checkoutDate = new Date(bookingData.checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate total room price (without taxes)
  const calculateRoomTotal = () => {
    if (!bookingData?.cart) return 0;
    const nights = calculateNights();
    return bookingData.cart.reduce(
      (total, item) => total + item.price * nights,
      0
    );
  };

  // Calculate total taxes from all room items
  const calculateTotalTaxes = () => {
    if (!bookingData?.cart) return 0;
    const nights = calculateNights();
    return bookingData.cart.reduce(
      (total, item) => total + (item.taxes || 0) * nights,
      0
    );
  };

  // Calculate grand total (room total + taxes)
  const calculateGrandTotal = () => {
    return calculateRoomTotal() + calculateTotalTaxes();
  };

  // Calculate individual room total with taxes
  const calculateRoomTotalWithTaxes = (item) => {
    const nights = calculateNights();
    const roomTotal = item.price * nights;
    const roomTaxes = (item.taxes || 0) * nights;
    return roomTotal + roomTaxes;
  };

  // Handle guest info changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guestInfo.name || !guestInfo.phone) {
      alert('Please fill out the required fields.');
      return;
    }

    const confirmedBooking = {
      ...bookingData,
      guestInfo,
      userId: user?.id || null, // Include user ID if available
      totalAmount: calculateGrandTotal(),
      totalTaxes: calculateTotalTaxes(),
      roomTotal: calculateRoomTotal(),
      nights: calculateNights()
    };

    // Save confirmed booking data
    localStorage.setItem('confirmedBooking', JSON.stringify(confirmedBooking));

    // Clear cart and review data
    localStorage.removeItem('bookingCart');
    localStorage.removeItem('bookingReviewData');

    console.log(confirmedBooking);
    alert('Booking confirmed successfully!');
    // router.push('/confirmation'); 
  };

  if (!bookingData) {
    return (
      <p className="text-center text-gray-600 mt-10">
        Loading booking data...
      </p>
    );
  }

  return (
    <div className="min-h-screen w-[90%] bg-gray-50 py-16 mx-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Review Your Booking</h1>
                <p className="text-blue-200">
                  Please review your details and complete the booking
                </p>
                {user && (
                  <div className="mt-2 flex items-center text-green-300">
                    <i className="fa-solid fa-user-check mr-2"></i>
                    <span>Logged in as {user.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Left Side - Guest Information Form */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Guest Information
                {user && (
                  <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Pre-filled from your profile
                  </span>
                )}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={guestInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your account name is pre-filled, but you can change it if needed.
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={guestInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  {user && user.phone && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your account phone number is pre-filled.
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your account email is pre-filled.
                    </p>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={4}
                    value={guestInfo.specialRequests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                {/* Confirm Booking Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    style={{
                      background: 'linear-gradient(90deg, #313881, #0678B4)',
                    }}
                    className="w-full text-white"
                  >
                    Confirm Booking
                    <i className="fa-solid fa-check ml-2"></i>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Side - Booking Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Booking Summary
              </h2>

              {/* User Info Display */}
              {user && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Account Information
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <i className="fa-solid fa-user text-green-600 mr-2"></i>
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Email: {user.email}</div>
                      {user.phone && <div>Phone: {user.phone}</div>}
                      <div className="text-xs text-green-600 mt-2">
                        ✓ Your account information is pre-filled in the form, but you can modify it if needed.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stay Dates */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Stay Duration
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-600">Check-in</div>
                      <div className="font-semibold">
                        {new Date(bookingData.checkin).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Check-out</div>
                      <div className="font-semibold">
                        {new Date(bookingData.checkout).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Total Nights:
                    </span>
                    <span className="font-semibold">{calculateNights()}</span>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Room Details
                </h3>
                <div className="space-y-4">
                  {bookingData.cart?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <span className="font-bold text-blue-900">
                          BDT {calculateRoomTotalWithTaxes(item)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Type: {item.type}</div>
                        <div>
                          Guests: {item.adults} Adults, {item.children} Children
                        </div>
                        <div>Breakfast: {item.breakfast}</div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>BDT {item.price} × {calculateNights()} nights</div>
                          <div className="flex justify-between">
                            <span>Room Total:</span>
                            <span>BDT {item.price * calculateNights()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees:</span>
                            <span>BDT {(item.taxes || 0) * calculateNights()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Price Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Room Total ({calculateNights()} nights)</span>
                    <span>BDT {calculateRoomTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>BDT {calculateTotalTaxes()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-blue-900">
                        BDT {calculateGrandTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Right Side */}
          </div>
        </div>
      </div>
    </div>
  );
}