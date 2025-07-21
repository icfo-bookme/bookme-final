'use client'
import { useEffect, useRef, useState } from 'react';
import getHotelDetails from "@/services/hotel/gethoteldetails";
import RoomComponent from './Room/Room';
import FacilitiesByCategory from './FacilitiesByCategory';
import HotelPolicies from './Policies';
import HotelCarousel from './HotelSlider';
import HotelDetails from './hoteldetails';

export default function HotelHashRoute({ hotelId, initialHotelDetails }) {
  const [hotelDetails, setHotelDetails] = useState(initialHotelDetails);
  const [activeSection, setActiveSection] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const sectionsRef = useRef({});
  const observerRef = useRef(null);
  const navRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  useEffect(() => {
    const checkScreenSize = () => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Set new timeout to debounce resize events
      resizeTimeoutRef.current = setTimeout(() => {
        setIsSmallDevice(window.innerWidth < 768);
      }, 100);
    };

    // Initial check
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);



  useEffect(() => {
    if (!hotelDetails) return;

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && sectionsRef.current && sectionsRef.current[hash]) {
        scrollToSection(hash, false);
      }
    };

    // Initialize Intersection Observer
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
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Observe all sections safely
    if (sectionsRef.current) {
      Object.values(sectionsRef.current).forEach((section) => {
        if (section && observerRef.current) {
          observerRef.current.observe(section);
        }
      });
    }

    // Check initial hash on load
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [hotelDetails]);

  const scrollToSection = (sectionId, smooth = true) => {
    if (!sectionsRef.current || !sectionsRef.current[sectionId]) return;

    const element = sectionsRef.current[sectionId];
    const offset = navRef.current ? navRef.current.offsetHeight + 20 : 100;

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: smooth ? 'smooth' : 'auto'
    });

    setActiveSection(sectionId);
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  if (!hotelDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const nearbyLocations = hotelDetails.near_by
    ? hotelDetails.near_by.split('|').map(loc => loc.trim()).filter(loc => loc)
    : [];

  const navItems = [
    { id: 'overview', label: 'Overview', showOnMobile: false },
    { id: 'rooms', label: 'Rooms', showOnMobile: true },
    { id: 'nearby', label: isSmallDevice ? "Nearby" : "What's Nearby", showOnMobile: true },
    { id: 'facilities', label: 'Facilities', showOnMobile: true },
    { id: 'policy', label: 'Policies', showOnMobile: true }
  ];

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = hotelDetails.description
    ? hotelDetails.description.length > 290
      ? hotelDetails.description.substring(0, 290) + '...'
      : hotelDetails.description
    : '';

  return (
    <div className="md:w-[90%] w-[96%] mx-auto">
      {/* Sticky Navigation Bar */}
      <div
        ref={navRef}
        className="sticky rounded-lg top-14 bg-white z-30 border-b  shadow-sm"
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto py-3 hide-scrollbar">
            <div className="flex space-x-1 min-w-max">
              {navItems.map((item) => (
                (!isSmallDevice || item.showOnMobile) && (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md whitespace-nowrap text-xs sm:text-sm font-medium transition-colors duration-200 ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-4 rounded-lg mx-auto grid grid-cols-1 bg-white md:grid-cols-10 gap-4">
        <div className="col-span-1 md:col-span-7 bg-white">
          <HotelCarousel hotelId={hotelId} />
        </div>

        <div className="col-span-1 md:col-span-3 bg-white">
          <HotelDetails hotel={hotelDetails} />

        </div>

      </div>

      <div className="py-6 space-y-8 sm:space-y-12">
        {/* Overview Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current['overview'] = el;
          }}
          id="overview"
          className={`bg-white rounded-lg p-4 sm:p-6 shadow-sm scroll-mt-24 ${isSmallDevice && !navItems.some(item => item.id === 'overview' && item.showOnMobile) ? '' : ''}`}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Hotel Description</h1>
          <div className='flex flex-wrap items-center gap-2 sm:gap-5 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6'>
            <div className='rounded-lg flex items-center gap-1 font-medium'>
              <span>Rooms: {hotelDetails.number_of_rooms}</span>
            </div>
            <p className="text-gray-600 flex items-center gap-1 font-medium">
              <span>Floors: {hotelDetails.Number_of_Floors}</span>
            </p>
            <p className="text-gray-600 flex items-center gap-1 font-medium">
              <span>Built: {hotelDetails.Year_of_construction}</span>
            </p>
          </div>

          {hotelDetails.description && (
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
                      <span>Show less</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </section>

        {/* Rooms Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current['rooms'] = el;
          }}
          id="rooms"
          className="scroll-mt-24"
        >
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <RoomComponent hotel_id={hotelId} />
          </div>
        </section>

        {/* Nearby Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current['nearby'] = el;
          }}
          id="nearby"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 scroll-mt-24"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            {isSmallDevice ? 'Nearby' : "What's Nearby"}
          </h2>
          {nearbyLocations.length > 0 ? (
            <ul className="space-y-2 sm:space-y-3">
              {nearbyLocations.map((location, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base">{location}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">No nearby locations information available</p>
          )}
        </section>

        {/* Facilities Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current['facilities'] = el;
          }}
          id="facilities"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 scroll-mt-24"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Facilities</h2>
          <FacilitiesByCategory categories={hotelDetails.category_wise_features} />
        </section>

        {/* Policy Section */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current['policy'] = el;
          }}
          id="policy"
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 scroll-mt-24"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Policies</h2>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <HotelPolicies Policies={hotelDetails.polices} />
          </div>
        </section>
      </div>

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