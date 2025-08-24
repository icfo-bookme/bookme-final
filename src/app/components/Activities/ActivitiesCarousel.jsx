'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { FaWhatsapp, FaPhone, FaClock, FaUserFriends } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const ActivitiesCarousel = ({ packages }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!packages || packages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
          Explore Our Exclusive Packages
        </h2>
        <p className="text-center text-gray-600">No packages available at the moment.</p>
      </div>
    );
  }

  const calculateFinalPrice = (pkg) => {
    const regularPrice = parseFloat(pkg.regular_price || 0);
    const discountAmount = parseFloat(pkg.discount_amount || 0);
    const discountPercentage = parseFloat(pkg.discount_percentage || 0);

    if (regularPrice <= 0) return 0;

    if (discountAmount > 0) {
      return Math.max(0, regularPrice - discountAmount);
    }

    if (discountPercentage > 0) {
      return regularPrice * (1 - discountPercentage / 100);
    }

    return regularPrice;
  };

  const hasDiscount = (pkg) =>
    parseFloat(pkg.discount_amount || 0) > 0 ||
    parseFloat(pkg.discount_percentage || 0) > 0;

  const getDiscountText = (pkg) => {
    const discountAmount = parseFloat(pkg.discount_amount || 0);
    const discountPercentage = parseFloat(pkg.discount_percentage || 0);

    if (discountAmount > 0) return `${discountAmount} TK OFF`;
    if (discountPercentage > 0) return `${discountPercentage}% OFF`;
    return '';
  };

  return (
    <div className="container mx-auto px-4 pt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-8">
        Explore Our Exclusive Packages
      </h2>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.activities-swiper-button-next',
            prevEl: '.activities-swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            el: '.activities-swiper-pagination',
          }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="w-[95%] mx-auto"
        >
          {packages.map((pkg) => {
            const finalPrice = calculateFinalPrice(pkg);
            const discountAvailable = hasDiscount(pkg);

            return (
              <SwiperSlide key={pkg.id} className="">
                <div className="bg-white h-96 rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 group">
                  <div className="relative h-48">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/storage/${pkg.image}`}
                      alt={pkg.package_name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    {discountAvailable && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        {getDiscountText(pkg)}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-blue-950 h-12 mb-2 line-clamp-2">
                      {pkg.package_name}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-blue-900" />
                        <span><span className="font-bold">Duration:</span> {pkg.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUserFriends className="mr-2 text-blue-900" />
                        <span><span className="font-bold">Up to:</span> {pkg.person_allowed} people</span>
                      </div>
                    </div>

                    <hr className="mb-4" />

                    <div className="mt-auto">
                      <div className="mb-4">
                        {parseFloat(pkg.regular_price) > 0 ? (
                          discountAvailable ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400 line-through">
                                {parseFloat(pkg.regular_price).toFixed(0)} TK
                              </span>
                              <span className="text-xl font-bold text-gray-800">
                                {finalPrice.toFixed(0)} TK
                              </span>
                              <span className='text-sm text-gray-600'>(per person)</span>
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-800">
                              {parseFloat(pkg.regular_price).toFixed(0)} TK
                            </div>
                          )
                        ) : (
                          <div className="text-md font-medium text-gray-600">Contact for price</div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <a
                          href="tel:+1234567890"
                          className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-2 px-3 w-full text-sm font-medium transition hover:bg-blue-100"
                        >
                          <FaPhone className="text-blue-600" />
                          Call Now
                        </a>
                        <a
                          href="https://wa.me/1234567890"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg py-2 px-3 w-full text-sm font-medium transition hover:bg-green-100"
                        >
                          <FaWhatsapp className="text-green-500" />
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="activities-swiper-button-prev absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white rounded-full shadow-md p-2 cursor-pointer hidden md:flex items-center justify-center w-10 h-10">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        <div className="activities-swiper-button-next absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white rounded-full shadow-md p-2 cursor-pointer hidden md:flex items-center justify-center w-10 h-10">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Pagination */}
        <div className="activities-swiper-pagination flex justify-center mt-6 space-x-2" />
      </div>
    </div>
  );
};

export default ActivitiesCarousel;
