'use client';
import { useEffect, useRef, useState } from 'react';
import RoomComponent from './Room/Room';
import FacilitiesByCategory from './FacilitiesByCategory';
import HotelPolicies from './Policies';
import HotelCarousel from './HotelSlider';
import HotelDetails from './hoteldetails';

export default function HotelHashRoute({ hotelId, initialHotelDetails }) {
  const [hotelDetails, setHotelDetails] = useState(initialHotelDetails);
  const [activeSection, setActiveSection] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionsRef = useRef({});
  const observerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!hotelDetails) return;

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
        rootMargin: isMobile ? '0px 0px -40% 0px' : '0px 0px -30% 0px',
        threshold: 0.1,
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observerRef.current.observe(section);
    });

    // Handle initial hash
    const handleInitialHash = () => {
      const hash = window.location.hash.substring(1) || 'overview';
      if (sectionsRef.current[hash]) {
        setTimeout(() => scrollToSection(hash, false), 100);
      }
    };

    handleInitialHash();

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
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'nearby', label: "What's Nearby" },
    { id: 'facilities', label: 'Facilities' },
    { id: 'policy', label: 'Policies' }
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
    <div className="md:w-[90%] w-[95%] mx-auto">
      {/* Navigation Bar - Sticky and responsive */}
      <div
        ref={navRef}
        className="sticky top-14 bg-white z-30 border-b shadow-sm"
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto py-3 hide-scrollbar">
            <div className="flex space-x-1 min-w-max">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md whitespace-nowrap text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Responsive grid */}
      <div className="p-2 md:p-4 rounded-lg mx-auto grid grid-cols-1 bg-white md:grid-cols-10 gap-4">
        <div className="col-span-1 md:col-span-7">
          <HotelCarousel images={hotelDetails?.images || []} />
        </div>
        <div className="col-span-1 md:col-span-3">
          <HotelDetails hotel={hotelDetails || {}} />
        </div>
      </div>

      {/* Content Sections with proper spacing */}
      <div className="py-6 space-y-6 sm:space-y-8">
        <section 
          ref={(el) => (sectionsRef.current['overview'] = el)}
          id="overview" 
          className="bg-white rounded-lg p-4 sm:p-6 shadow-sm scroll-mt-24"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Hotel Description</h1>
          <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6'>
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
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}
        </section>

        <section 
          ref={(el) => (sectionsRef.current['rooms'] = el)}
          id="rooms" 
          className="scroll-mt-24"
        >
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <RoomComponent hotel_id={hotelId} />
          </div>
        </section>

        <section 
          ref={(el) => (sectionsRef.current['nearby'] = el)}
          id="nearby" 
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 scroll-mt-24"
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
              <p className="text-gray-500 text-sm sm:text-base">No nearby locations available</p>
            </div>
          )}
        </section>

        <section 
          ref={(el) => (sectionsRef.current['facilities'] = el)}
          id="facilities" 
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 scroll-mt-24"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Facilities</h2>
          <FacilitiesByCategory categories={hotelDetails.category_wise_features || {}} />
        </section>

        <section 
          ref={(el) => (sectionsRef.current['policy'] = el)}
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