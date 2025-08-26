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

export default function ActivitiesCarousel({ packages = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showPagination, setShowPagination] = useState(false);

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
      .replace(/\s+/g, '-')        // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')    // Remove non-word chars
      .replace(/\-\-+/g, '-');     // Replace multiple dashes with one



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
            loop={packages.length > 3} // Only loop if we have more than 3 packages
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
                  speed: 400,
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

                    <div className="mt-auto pt-4 flex justify-between items-center">
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

                      {/* Contact Us Button */}
                      <Link
                        href="/contact"
                        className="text-sm hidden md:block mt-3 px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center"
                        style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                      >
                        Contact
                     
                      </Link>

                      <Link
                        href="/contact"
                        className="text-sm md:hidden mt-3 px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center"
                        style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                      >
                        Contact
                        
                      </Link>
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

        </div>
      ) : (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-600 text-base sm:text-lg">No packages available at the moment.</p>
        </div>
      )}
    </div>
  );
}