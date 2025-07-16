'use client'
import { useEffect, useRef, useState } from 'react';
import getHotelDetails from "@/services/hotel/gethoteldetails";
import RoomComponent from './Room/Room';
import FacilitiesByCategory from './FacilitiesByCategory';

export default function HotelHashRoute({ hotelId }) {
  const [hotelDetails, setHotelDetails] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const sectionsRef = useRef({});
  const observerRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallDevice(window.innerWidth < 640); // Tailwind's 'sm' breakpoint is 640px
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHotelDetails(hotelId);
      setHotelDetails(data);
    };
    fetchData();
  }, [hotelId]);

  useEffect(() => {
    // Initialize Intersection Observer for better section detection
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // Update URL hash without scrolling
            window.history.replaceState(null, '', `#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) {
        observerRef.current.observe(section);
      }
    });

    // Check initial hash on load
    const hash = window.location.hash.substring(1);
    if (hash && sectionsRef.current[hash]) {
      scrollToSection(hash, false);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hotelDetails]); // Re-run when hotel details are loaded

  const scrollToSection = (sectionId, smooth = true) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: smooth ? 'smooth' : 'auto'
      });
      setActiveSection(sectionId);
    }
  };

  if (!hotelDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Split the near_by string into an array of locations
  const nearbyLocations = hotelDetails.near_by
    ? hotelDetails.near_by.split(',').map(loc => loc.trim()).filter(loc => loc)
    : [];

  const navItems = [
    ...(!isSmallDevice ? [{ id: 'overview', label: 'Overview' }] : []),
    { id: 'rooms', label: 'Rooms' },
    { id: 'nearby', label: isSmallDevice ? "Nearby" : "What's Nearby" },
    { id: 'facilities', label: 'Facilities' },
    { id: 'policy', label: 'Policy' }
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
    <div className="md:w-[85%] w-[96%] mx-auto">
      {/* Sticky Navigation Bar */}
      <div className="sticky top-14 rounded-lg bg-white z-30 border-b shadow-sm">
        <div className="flex overflow-x-auto py-4 ml-4 hide-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 whitespace-nowrap font-medium text-sm transition-colors ${
                activeSection === item.id
                  ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-8">
        {/* Overview Section */}
        {!isSmallDevice && (
          <section
            ref={(el) => (sectionsRef.current['overview'] = el)}
            id="overview"
            className="mb-12 bg-white rounded-lg p-4 scroll-mt-20"
          >
            <h1 className="text-2xl md:text-xl font-bold text-gray-800 mb-4">Hotel Description</h1>
            <div className='flex flex-wrap items-center gap-2 md:gap-5 text-sm text-gray-600 mb-6'>
              <div className='rounded-lg flex items-center gap-1 font-bold'>
                <span>Number of Rooms: {hotelDetails.number_of_rooms}</span>
              </div>
              <p className="text-gray-600 flex items-center gap-1 font-bold">
                <span>Number of Floors: {hotelDetails.Number_of_Floors}</span>
              </p>
              <p className="text-gray-600 flex items-center gap-1 font-bold">
                <span> Year of construction: {hotelDetails.Year_of_construction}</span>
              </p>
            </div>

            {hotelDetails.description && (
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {showFullDescription ? hotelDetails.description : truncatedDescription}
                </p>
                {hotelDetails.description.length > 300 && (
                  <button
                    onClick={toggleDescription}
                    className="text-blue-800 border-b border-blue-500 hover:text-blue-700 mt-2 text-sm font-medium"
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Rooms Section */}
        <section
          ref={(el) => (sectionsRef.current['rooms'] = el)}
          id="rooms"
          className="mb-12 pt-4 scroll-mt-20"
        >
          <div className="rounded-lg">
            <RoomComponent hotel_id={hotelId} />
          </div>
        </section>

        {/* What's Nearby Section */}
        <section
          ref={(el) => (sectionsRef.current['nearby'] = el)}
          id="nearby"
          className="mb-12 pt-4 scroll-mt-20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">{isSmallDevice ? 'Nearby' : 'Whats Nearby'}</h2>
          {nearbyLocations.length > 0 ? (
            <ul className="space-y-3">
              {nearbyLocations.map((location, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot text-blue-500 mt-1"></i>
                  <span className="text-gray-700">{location}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No nearby locations information available</p>
          )}
        </section>

        {/* Facilities Section */}
        <section
          ref={(el) => (sectionsRef.current['facilities'] = el)}
          id="facilities"
          className="mb-12 pt-4 scroll-mt-20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Facilities</h2>
          <FacilitiesByCategory categories={hotelDetails.category_wise_features} />
        </section>

        {/* Policy Section */}
        <section
          ref={(el) => (sectionsRef.current['policy'] = el)}
          id="policy"
          className="mb-12 pt-4 scroll-mt-20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Policy</h2>
          <div className="bg-gray-100 p-8 rounded-lg">
            <p className="text-center text-gray-500">Hotel policies will be displayed here</p>
          </div>
        </section>
      </div>

      {/* Custom scrollbar hide for navigation */}
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