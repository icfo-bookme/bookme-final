'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { TailSpin } from "react-loader-spinner";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function ActivitiesCarousel({ packages = [], property_id }) {

  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showPagination, setShowPagination] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [fetchingPickup, setFetchingPickup] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    packageId: null,
    adults: 1,
    children: 0,
    date: "",
    time: "",
    pickupLocation: ""
  });

  // Generate time slots from 8:00 AM to 4:00 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 16 && minute > 0) break; // Stop after 4:00 PM
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute === 0 ? '00' : minute;
        
        times.push({
          value: `${hour}:${minute.toString().padStart(2, '0')}`,
          display: `${displayHour}:${displayMinute} ${period}`
        });
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  // Fetch pickup destinations from API
  useEffect(() => {
    const fetchPickupDestinations = async () => {
      if (!property_id) return;
      
      setFetchingPickup(true);
      try {
        const response = await fetch(
          `https://bookme.com.bd/admin/api/pickup/destinations/${property_id}`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Extract destination names from API response
          const destinations = data.map(item => item.destination);
          setPickupLocations(destinations);
          
          // Set default pickup location if destinations exist
          if (destinations.length > 0) {
            setBookingDetails(prev => ({
              ...prev,
              pickupLocation: destinations[0]
            }));
          }
        } else {
          console.error("Failed to fetch pickup destinations");
          // Fallback locations if API fails
          setPickupLocations([
            "Dhaka City Center",
            "Airport Terminal",
            "Gulshan Circle 1",
            "Uttara Sector 7",
            "Dhanmondi 27"
          ]);
        }
      } catch (error) {
        console.error("Error fetching pickup destinations:", error);
        // Fallback locations on error
        setPickupLocations([
          "Dhaka City Center",
          "Airport Terminal",
          "Gulshan Circle 1",
          "Uttara Sector 7",
          "Dhanmondi 27"
        ]);
      } finally {
        setFetchingPickup(false);
      }
    };

    fetchPickupDestinations();
  }, [property_id]);

  // Refs for detecting outside clicks
  const guestModalRef = useRef(null);
  const bookingModalRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close guest modal if clicking outside of it
      if (showGuestModal && guestModalRef.current && !guestModalRef.current.contains(event.target)) {
        setShowGuestModal(false);
      }
      
      // Only close booking modal if clicking outside of it and not on guest selector trigger
      // AND if guest modal is not open
      if (showBookingModal && !showGuestModal && bookingModalRef.current && 
          !bookingModalRef.current.contains(event.target) && 
          !event.target.closest('.guest-selector-trigger')) {
        setShowBookingModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestModal, showBookingModal]);

  useEffect(() => {
    if (packages && packages.length > 0) {
      setLoading(false);
      setShowPagination(packages.length > 3);
    }
  }, [packages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const stopAutoplay = () => {
    if (swiperRef.current?.swiper?.autoplay?.running) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const startAutoplay = () => {
    if (swiperRef.current?.swiper && !swiperRef.current.swiper.autoplay.running) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  const handleTouchStart = () => {
    if (isMobile) {
      stopAutoplay();
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        startAutoplay();
      }, 5000);
    }
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  // Check if package has a discount
  const hasDiscount = (pkg) => {
    return (pkg.discount_amount && pkg.discount_amount > 0) ||
      (pkg.discount_percentage && pkg.discount_percentage > 0);
  };

  const getDiscountText = (pkg) => {
    if (pkg.discount_amount && pkg.discount_amount > 0) {
      return `Save ${Math.round(pkg.discount_amount)} TK`;
    } else if (pkg.discount_percentage && pkg.discount_percentage > 0) {
      return `${Math.round(pkg.discount_percentage)}% Off`;
    }
    return "";
  };

  const getSlidesPerView = () => {
    if (packages.length <= 3) {
      return packages.length;
    }
    return {
      350: 1.4,
      640: 1.5,
      768: 2,
      1024: 3,
      1280: 3
    };
  };

  const handleAddToCart = (pkg) => {
    setSelectedPackage(pkg);
    setBookingDetails({
      packageId: pkg.id,
      adults: 1,
      children: 0,
      date: "",
      time: "",
      pickupLocation: pickupLocations[0] || ""
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = () => {
    // Here you would typically send the data to your booking system
    console.log("Booking details:", bookingDetails);
    alert("Booking confirmed successfully!");
    setShowBookingModal(false);
  };

  const updateGuestCount = (type, operation) => {
    setBookingDetails(prev => {
      const newCount = operation === 'increase' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure at least 1 adult if there are children
      if (type === 'adults' && newCount === 0 && prev.children > 0) {
        return { ...prev, adults: 1 };
      }
      
      return { ...prev, [type]: newCount };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`${roboto.className} bg-blue-50 w-full mx-auto max-w-7xl`}>
      <div className="w-full text-center mb-5">
        <h2 className="text-xl mt-8 md:text-2xl font-bold text-[#00026E] mb-2">
          Popular packages 
        </h2>
        <div className="w-20 h-1 bg-[#0678B4] mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <TailSpin height="60" width="60" color="#0678B4" ariaLabel="loading" />
        </div>
      ) : packages && packages.length > 0 ? (
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={16}
            slidesPerView={getSlidesPerView()}
            centeredSlides={packages.length <= 3 ? false : true}
            loop={packages.length > 3}
            initialSlide={packages.length > 3 ? 1 : 0}
            speed={isMobile ? 1000 : 1000}
            autoplay={
              packages.length > 3 ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false
            }
            navigation={
              packages.length > 3 ? {
                nextEl: '.package-swiper-button-next',
                prevEl: '.package-swiper-button-prev',
              } : false
            }
            pagination={
              showPagination ? {
                clickable: true,
              } : false
            }
            freeMode={{
              enabled: isMobile && packages.length > 3,
              momentum: true,
              momentumRatio: 2,
              velocityRatio: 3.5,
              sticky: false,
            }}
            resistanceRatio={1}
            touchStartPreventDefault={false}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onSliderMove={handleTouchStart}
            onTransitionEnd={handleTouchEnd}
            breakpoints={
              packages.length > 3 ? {
                350: {
                  slidesPerView: 1.4,
                  centeredSlides: true,
                  speed: 300,
                  freeMode: {
                    enabled: true,
                    momentum: true,
                    momentumRatio: 5,
                    velocityRatio: 5.5,
                    sticky: false
                  },
                },
                640: {
                  slidesPerView: 1.5,
                  centeredSlides: true,
                  freeMode: {
                    enabled: true,
                    momentum: true,
                    momentumRatio: 2,
                    velocityRatio: 3.5,
                    sticky: false
                  },
                },
                768: {
                  slidesPerView: 2,
                  centeredSlides: false,
                  speed: 500,
                  freeMode: false,
                },
                1024: {
                  slidesPerView: 3,
                  slidesPerGroup: 1,
                  speed: 700,
                  freeMode: false,
                },
                1280: {
                  slidesPerView: 3,
                  slidesPerGroup: 1,
                  speed: 800,
                  freeMode: false,
                }
              } : undefined
            }
            className="w-full md:w-[90%] lg:w-[89%] mx-auto"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id} className="h-auto">
                <div className="flex flex-col rounded-lg bg-white h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                  <div className="relative h-48 sm:h-56 md:h-56 lg:h-56 w-full bg-gray-200">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.image}`}
                      alt={pkg.package_name}
                      fill
                      className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 30vw, 25vw"
                    />
                    {/* Discount Badge */}
                    {hasDiscount(pkg) && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {getDiscountText(pkg)}
                      </div>
                    )}
                    {/* Package Type Badge */}
                    {pkg.package_type && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {pkg.package_type.charAt(0).toUpperCase() + pkg.package_type.slice(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                    <Link href={`/package/list/details/${slugify(pkg.package_name)}/${pkg.id}`}>
                      <h3 className="text-lg md:text-xl h-16 font-bold text-[#00026E] mb-2 hover:text-blue-700 transition-colors line-clamp-2">
                        {pkg.package_name}
                      </h3>
                    </Link>

                    {/* Package Details */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {pkg.duration}
                        </div>
                      )}
                      {pkg.person_allowed && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {pkg.person_allowed} Persons
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-3">
                      {/* Price Info */}
                      <div>
                        <span className="text-xs sm:text-sm text-gray-600">Starting from</span>
                        <div className="flex items-center gap-2 font-bold text-lg sm:text-xl text-blue-900">
                          {pkg?.discounted_price && pkg.discounted_price > 0 ? (
                            <>
                              <span>{pkg.discounted_price.toLocaleString()} TK</span>
                              <span className="line-through text-sm text-gray-500 font-medium">
                                {pkg.regular_price?.toLocaleString()} TK
                              </span>
                            </>
                          ) : (
                            <span>{pkg.regular_price?.toLocaleString()} TK</span>
                          )}
                        </div>
                      </div>

                      {/* Buttons Container */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Contact Us Button */}
                        <Link
                          href="/contact"
                          className="flex-1 text-center text-sm px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                          style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                        >
                          See Details
                        </Link>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(pkg)}
                           style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                          className="flex-1 text-sm px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper Navigation Buttons - Only show if we have more than 3 packages */}
          {packages.length > 3 && (
            <>
              <button className="package-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none border border-blue-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="package-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none border border-blue-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}

          {/* Booking Modal */}
          {showBookingModal && selectedPackage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div 
                ref={bookingModalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold text-[#00026E]">Complete Your Booking</h3>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Package Info */}
                  <div className="flex items-start gap-4 pb-5 mb-5 border-b">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${selectedPackage.image}`}
                        alt={selectedPackage.package_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#00026E]">{selectedPackage.package_name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{selectedPackage.duration}</p>
                      <p className="font-semibold text-blue-900">
                        {selectedPackage.discounted_price ? 
                          `${selectedPackage.discounted_price.toLocaleString()} TK` : 
                          `${selectedPackage.regular_price.toLocaleString()} TK`
                        }
                        <span className="text-xs font-normal text-gray-500 ml-2">per person</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Booking Form */}
                  <div className="space-y-5">
                    {/* First Row - Pickup Location & Guest Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pickup Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Starting Point/Pickup Location</label>
                        {fetchingPickup ? (
                          <div className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center">
                            <TailSpin height="20" width="20" color="#0678B4" />
                          </div>
                        ) : (
                          <select 
                            value={bookingDetails.pickupLocation}
                            onChange={(e) => setBookingDetails({...bookingDetails, pickupLocation: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {pickupLocations.map((location, index) => (
                              <option key={index} value={location}>{location}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      
                      {/* Guest Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                        <div 
                          onClick={() => setShowGuestModal(true)}
                          className="guest-selector-trigger w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex justify-between items-center hover:border-blue-400 transition-colors"
                        >
                          <span>
                            {bookingDetails.adults} Adult{bookingDetails.adults !== 1 ? 's' : ''}, {bookingDetails.children} Child{bookingDetails.children !== 1 ? 'ren' : ''}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Second Row - Date Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                      <input 
                        type="date"
                        value={bookingDetails.date}
                        onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {bookingDetails.date && (
                        <p className="text-sm text-blue-600 mt-1">{formatDate(bookingDetails.date)}</p>
                      )}
                    </div>
                    
                    {/* Third Row - Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => setBookingDetails({...bookingDetails, time: slot.value})}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              bookingDetails.time === slot.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-8 pt-5 border-t">
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!bookingDetails.date || !bookingDetails.time || !bookingDetails.pickupLocation}
                      style={{
                        background: "linear-gradient(90deg, #313881, #0678B4)"
                      }}
                      className="w-full py-3 px-4 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      Confirm Booking - 
                      <span className="ml-1 font-semibold">
                        {selectedPackage.discounted_price 
                          ? (selectedPackage.discounted_price * (bookingDetails.adults + bookingDetails.children)).toLocaleString()
                          : (selectedPackage.regular_price * (bookingDetails.adults + bookingDetails.children)).toLocaleString()
                        } TK
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guest Selection Modal */}
          {showGuestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div 
                ref={guestModalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold text-[#00026E]">Number of Guests</h3>
                  <button 
                    onClick={() => setShowGuestModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Adults Counter */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-700">Adults</h4>
                      <p className="text-sm text-gray-500">Age 13+</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateGuestCount('adults', 'decrease')}
                        disabled={bookingDetails.adults <= 1}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{bookingDetails.adults}</span>
                      <button
                        onClick={() => updateGuestCount('adults', 'increase')}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Children Counter */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-700">Children</h4>
                      <p className="text-sm text-gray-500">Ages 2-12</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateGuestCount('children', 'decrease')}
                        disabled={bookingDetails.children <= 0}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{bookingDetails.children}</span>
                      <button
                        onClick={() => updateGuestCount('children', 'increase')}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t">
                  <button
                    onClick={() => setShowGuestModal(false)}
                    style={{
                      background: "linear-gradient(90deg, #313881, #0678B4)"
                    }}
                    className="w-full py-3 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirm Guests
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-600 text-base sm:text-lg">No packages available at the moment.</p>
        </div>
      )}
    </div>
  );
}