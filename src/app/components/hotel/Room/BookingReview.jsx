'use client';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';

const BookingReview = ({ onBackToCart, onBackToRooms, onSubmitBooking, hotelId }) => {
    const [bookingData, setBookingData] = useState(null);
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        phone: '',
        email: '',
        specialRequests: ''
    });

    // Load booking data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('bookingData');
        const savedCart = localStorage.getItem('bookingCart');
        
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setBookingData(parsedData);
            } catch (error) {
                console.error('Error loading booking data:', error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateNights = () => {
        if (!bookingData?.checkin || !bookingData?.checkout) return 1;
        const checkin = new Date(bookingData.checkin);
        const checkout = new Date(bookingData.checkout);
        const diffTime = Math.abs(checkout - checkin);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const calculateTotal = () => {
        if (!bookingData?.cart) return 0;
        const nights = calculateNights();
        return bookingData.cart.reduce((sum, item) => sum + (item.total * nights), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!guestInfo.name || !guestInfo.phone) {
            alert('Please fill in all required fields');
            return;
        }

        // Prepare complete booking data
        const completeBookingData = {
            ...bookingData,
            guestInfo,
            hotelId,
            submittedAt: new Date().toISOString(),
            totalAmount: calculateTotal() + Math.round(calculateTotal() * 0.1),
            bookingReference: 'BK' + Date.now()
        };
        
        if (onSubmitBooking) {
            onSubmitBooking(completeBookingData);
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-[90%] bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-900 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Review Your Booking</h1>
                                <p className="text-blue-200">Please review your details and complete the booking</p>
                            </div>
                            <Button
                                onClick={onBackToRooms}
                                color="light"
                                className="text-blue-900"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Back to Rooms
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        {/* Left Side - Guest Information Form */}
                        <div>
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Guest Information</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                </div>

                                <div>
                                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
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

                                <div className="flex space-x-4 pt-4">
                                    <Button
                                        type="button"
                                        onClick={onBackToCart}
                                        color="gray"
                                        className="flex-1"
                                    >
                                        <i className="fa-solid fa-arrow-left mr-2"></i>
                                        Back to Cart
                                    </Button>
                                    <Button
                                        type="submit"
                                        style={{
                                            background: "linear-gradient(90deg, #313881, #0678B4)",
                                        }}
                                        className="flex-1 text-white"
                                    >
                                        Confirm Booking
                                        <i className="fa-solid fa-check ml-2"></i>
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Right Side - Booking Summary */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Booking Summary</h2>
                            
                            {/* Stay Dates */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Stay Duration</h3>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <div className="text-sm text-gray-600">Check-in</div>
                                            <div className="font-semibold">
                                                {new Date(bookingData.checkin).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Check-out</div>
                                            <div className="font-semibold">
                                                {new Date(bookingData.checkout).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">Total Nights:</span>
                                        <span className="font-semibold">{calculateNights()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Room Details</h3>
                                <div className="space-y-4">
                                    {bookingData.cart.map((item, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                                <span className="font-bold text-blue-900">BDT {item.total * calculateNights()}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div>Type: {item.type}</div>
                                                <div>Guests: {item.adults} Adults, {item.children} Children</div>
                                                <div>Breakfast: {item.breakfast}</div>
                                                <div className="text-xs text-gray-500">
                                                    BDT {item.price} × {calculateNights()} nights
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-3">Price Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Room Total ({calculateNights()} nights)</span>
                                        <span>BDT {calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Taxes & Fees (10%)</span>
                                        <span>BDT {Math.round(calculateTotal() * 0.1)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total Amount</span>
                                            <span className="text-blue-900">
                                                BDT {calculateTotal() + Math.round(calculateTotal() * 0.1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingReview;