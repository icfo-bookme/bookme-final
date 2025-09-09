'use client';

import { useEffect, useRef, useState } from 'react';
import RoomComponent from './Room/Room';
import FacilitiesByCategory from './FacilitiesByCategory';
import HotelPolicies from './Policies';
import HotelCarousel from './HotelSlider';
import HotelDetails from './hoteldetails';

export default function HotelHashRoute({ hotelId, initialHotelDetails, checkin, checkout }) {
  const [hotelDetails, setHotelDetails] = useState(initialHotelDetails);
  const [activeSection, setActiveSection] = useState('rooms');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialHotelDetails);
  const [navScrollIndex, setNavScrollIndex] = useState(0);

  const sectionsRef = useRef({});
  const observerRef = useRef(null);
  const navRef = useRef(null);
  const navContainerRef = useRef(null);

  const navItems = [
    { id: 'rooms', label: 'Rooms', icon: 'fa-bed' },
    { id: 'facilities', label: 'Facilities', icon: 'fa-wifi' },
    { id: 'Summary', label: 'Summary', icon: 'fa-info-circle' },
    { id: 'nearby', label: "What's Nearby", icon: 'fa-location-dot' },
    { id: 'policy', label: 'Policies', icon: 'fa-clipboard-list' }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hotelId, initialHotelDetails]);

  useEffect(() => {
    if (!hotelDetails) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
            if (window.location.hash.substring(1) !== sectionId) {
              window.history.replaceState(null, '', `#${sectionId}`);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: isMobile ? '0px 0px -40% 0px' : '0px 0px -30% 0px',
        threshold: 0.1,
      }
    );

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hotelDetails, isMobile]);

  const scrollToSection = (sectionId, smooth = true) => {
    const element = sectionsRef.current[sectionId];
    if (!element) return;

    const offset = (navRef.current?.offsetHeight || 64) + (isMobile ? 10 : 20);
    const targetPosition = element.offsetTop - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: smooth ? 'smooth' : 'auto',
    });

    setActiveSection(sectionId);
  };

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleNavScroll = (direction) => {
    if (direction === 'prev' && navScrollIndex > 0) {
      setNavScrollIndex(navScrollIndex - 1);
    } else if (direction === 'next' && navScrollIndex < navItems.length - 3) {
      setNavScrollIndex(navScrollIndex + 1);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getVisibleNavItems = () => {
    if (!isMobile) return navItems;
    return navItems.slice(navScrollIndex, navScrollIndex + 3);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hotelDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <div className="text-red-500 mb-4">
          <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Failed to load hotel details</h3>
        <p className="text-gray-600 max-w-md">
          We could not load the hotel information. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const nearbyLocations = hotelDetails.near_by
    ? hotelDetails.near_by.split('|').map(loc => loc.trim()).filter(loc => loc)
    : [];

  const truncatedDescription = hotelDetails.description
    ? hotelDetails.description.length > 290
      ? hotelDetails.description.substring(0, 290) + '...'
      : hotelDetails.description
    : '';

  return (
    <div className="md:w-[90%] w-[95%] mx-auto">
      {/* Navigation Bar - Sticky and responsive */}
      <div
        ref={navRef}
        className="sticky top-14 bg-white z-30 border-b rounded-lg shadow-sm"
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex py-3">
            {isMobile && navScrollIndex > 0 && (
              <button
                onClick={() => handleNavScroll('prev')}
                className="p-2 rounded-full hover:bg-gray-100 mr-1"
                aria-label="Previous navigation items"
              >
                <i className="fa-solid fa-chevron-left text-gray-600"></i>
              </button>
            )}

            <div
              ref={navContainerRef}
              className="flex-1 flex overflow-x-auto hide-scrollbar"
            >
              <div className="flex space-x-1 min-w-max ">
                {getVisibleNavItems().map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md whitespace-nowrap text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {isMobile && navScrollIndex < navItems.length - 3 && (
              <button
                onClick={() => handleNavScroll('next')}
                className="p-2 rounded-full hover:bg-gray-100 ml-1"
                aria-label="Next navigation items"
              >
                <i className="fa-solid fa-chevron-right text-gray-600"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <section>
        <div className="p-2 md:p-4 mt-5 rounded-lg mx-auto grid grid-cols-1 bg-white md:grid-cols-10 gap-4">
          <div className="col-span-1 md:col-span-7">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <i className="fa-solid fa-info-circle text-blue-600"></i>
              Hotel Summary
            </h2>
            <HotelCarousel images={hotelDetails?.images || []} />
          </div>
          <div className="col-span-1 pt-8 md:col-span-3">
            <HotelDetails hotel={hotelDetails} />
          </div>
        </div>
      </section>
      {/* Rooms Section */}
      <section
        ref={(el) => (sectionsRef.current['rooms'] = el)}
        id="rooms"
        className="scroll-mt-26 mt-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <i className="fa-solid fa-bed text-blue-600"></i>
            Available Rooms
          </h2>
          <RoomComponent hotel_id={hotelId} checkin={checkin} checkout={checkout} />
        </div>
      </section>

      {/* Facilities Section */}
      <section
        ref={(el) => (sectionsRef.current['facilities'] = el)}
        id="facilities"
        className="bg-white rounded-lg shadow-sm mt-5 scroll-mt-24"
      >
        <h2 className="text-lg sm:text-xl pt-4 font-bold text-gray-800 m-4 sm:mb-6 flex items-center gap-2">
          <i className="fa-solid fa-wifi text-blue-600"></i>
          Hotel Facilities
        </h2>
        <FacilitiesByCategory categories={hotelDetails?.category_wise_features || {}} />
      </section>

      {/* Main Layout - Responsive grid */}
      <section
        ref={(el) => (sectionsRef.current['Summary'] = el)}
        id="Summary"
        className="scroll-mt-24"
      >


        {/* Hotel Description Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mt-4">
          <h1 className="text-xl sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Hotel Description</h1>
          <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6'>
            {hotelDetails?.number_of_rooms && (
              <div className='rounded-lg flex items-center gap-1 font-medium'>
                <i className="fa-solid fa-door-closed"></i>
                <span>Rooms: {hotelDetails.number_of_rooms || 'N/A'}</span>
              </div>
            )}
            {hotelDetails?.Number_of_Floors && (
              <div className="text-gray-600 flex items-center gap-1 font-medium">
                <i className="fa-solid fa-building"></i>
                <span>Floors: {hotelDetails.Number_of_Floors || 'N/A'}</span>
              </div>
            )}
            {hotelDetails?.Year_of_construction && (
              <div className="text-gray-600 flex items-center gap-1 font-medium">
                <i className="fa-solid fa-calendar"></i>
                <span>Built: {hotelDetails.Year_of_construction || 'N/A'}</span>
              </div>
            )}
          </div>

          {hotelDetails?.description && (
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {showFullDescription ? hotelDetails.description : truncatedDescription}
              </p>
              {hotelDetails.description.length > 300 && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-600 hover:text-blue-800 mt-2 text-xs sm:text-sm font-medium flex items-center"
                >
                  {showFullDescription ? (
                    <>
                      <i className="fa-solid fa-chevron-up mr-1"></i> Show less
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-chevron-down mr-1"></i> Show more
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Nearby Locations Section */}
      <section
        ref={(el) => (sectionsRef.current['nearby'] = el)}
        id="nearby"
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 scroll-mt-24 mt-6"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-blue-600"></i>
            Nearby Locations
          </h2>
          {nearbyLocations.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {nearbyLocations.length} places
            </span>
          )}
        </div>

        {nearbyLocations.length > 0 ? (
          <ul className="space-y-2 sm:space-y-3">
            {nearbyLocations.map((location, index) => (
              <li key={index} className="flex items-start gap-3 group hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors">
                <i className="fa-solid fa-location-dot text-gray-400 mt-0.5"></i>
                <span className="text-gray-800 text-sm sm:text-base">{location}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <i className="fa-solid fa-map-location-dot text-gray-300 text-3xl mb-2"></i>
            <p className="text-gray-500 text-sm sm:text-base">No nearby locations information available</p>
          </div>
        )}
      </section>

      {/* Policies Section */}
      <section
        ref={(el) => (sectionsRef.current['policy'] = el)}
        id="policy"
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 scroll-mt-24 mt-6 mb-8"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <i className="fa-solid fa-clipboard-list text-blue-600"></i>
          Hotel Policies
        </h2>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <HotelPolicies Policies={hotelDetails.polices} />
        </div>
      </section>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}