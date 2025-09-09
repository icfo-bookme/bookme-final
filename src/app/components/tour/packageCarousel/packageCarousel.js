import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Pagination } from "swiper";
import LoadingSpinner from '@/utils/LoadingSpinner';

const PackageCarousel = ({
  propertyPackages,
  loading,
  contactNumber,
}) => {
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!propertyPackages || propertyPackages.length === 0) {
    return <div>No packages available</div>;
  }

  const maxWidthClass = propertyPackages.length === 1 ? 'max-w-md' : 'max-w-full';

  const getSlidesPerView = (packageCount, breakpoint) => {
    if (packageCount === 1) return 1;
    if (breakpoint === 'xs') return Math.min(1.4, packageCount);
    if (breakpoint === 'sm') return Math.min(1.5, packageCount);
    if (breakpoint === 'md') return Math.min(2, packageCount);
    if (breakpoint === 'lg') return Math.min(3, packageCount);
    if (breakpoint === 'xl') return Math.min(3, packageCount);
    return Math.min(3, packageCount);
  };

  const getInitialSlide = () => {
    if (propertyPackages.length <= 1) return 0;
    return 1; 
  };

  return (
    <div className={`relative mx-auto ${maxWidthClass}`}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        initialSlide={getInitialSlide()}
        navigation={{
          nextEl: '.property-swiper-button-next',
          prevEl: '.property-swiper-button-prev',
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          350: {
            slidesPerView: getSlidesPerView(propertyPackages.length, 'xs'),
            spaceBetween: 16,
            centeredSlides: propertyPackages.length === 1 ? false : true,
          },
          640: {
            slidesPerView: getSlidesPerView(propertyPackages.length, 'sm'),
            spaceBetween: 16,
            centeredSlides: true, 
          },
          768: {
            slidesPerView: getSlidesPerView(propertyPackages.length, 'md'),
            spaceBetween: 24,
            centeredSlides: false,
          },
          1024: {
            slidesPerView: getSlidesPerView(propertyPackages.length, 'lg'),
            spaceBetween: 28,
            centeredSlides: false,
          },
          1280: {
            slidesPerView: getSlidesPerView(propertyPackages.length, 'xl'),
            spaceBetween: 32,
            centeredSlides: false,
          }
        }}
        className="w-full md:w-[90%] lg:w-[89%] mx-auto"
      >
        {propertyPackages.map((pkg) => (
          <SwiperSlide key={pkg.unit_id}>
            <div className="relative z-10 bg-white shadow-xl rounded-lg overflow-visible h-[425px] w-full">
              {(pkg?.discount?.discount_percent > 0 || pkg?.discount?.discount_amount > 0) && (
                <div className="flex flex-col bg-red-700 h-14 justify-center rounded-full shadow-md text-white text-xs w-14 -right-[0.07rem] top-[0rem] absolute font-semibold items-center py-2 z-40">
                  <span>
                    {pkg.discount.discount_percent > 0 
                      ? `${Math.floor(pkg.discount.discount_percent)}%`
                      : `${Math.floor(pkg.discount.discount_amount)} TK`}
                  </span>
                  <span className="text-[10px]">OFF</span>
                </div>
              )}
              <div className="flex flex-col h-full items-center mx-auto">
                <div className="relative w-full h-[180px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.mainimg}`}
                    alt={pkg.unit_id}
                    fill
                    className="rounded-t-lg object-cover"
                  />
                </div>
                <div className="flex font-semibold flex-1 flex-col p-[12px] shadow-lg w-full">
                  <h2 className={`font-heading text-[18px] font-bold text-blue-900 pb-2`}>
                    {pkg.unit_name}
                  </h2>
                  <p className={`text-gray-800 text-[16px]`}>
                    Unit Type: {pkg.unit_type} | Person Allowed:{" "}
                    {pkg.person_allowed} 
                    {pkg?.additionalbed === 1
                      ? " | Additional Bed: Available"
                      : pkg?.additionalbed === 0
                      ? ""
                      : ""}
                  </p>
                  <div className="flex justify-start items-center">
                    <div className={`flex gap-2 mt-3 mb-4`}>
                      <Link href={`tel:${contactNumber?.Phone}`} target="_blank" rel="noopener noreferrer">
                        <div className="flex border border-blue-950 justify-center rounded-full text-black text-center text-sm font-heading items-center px-3 py-1 sm:w-[90px]">
                          Call Now
                        </div>
                      </Link>
                      <Link href={`https://wa.me/${contactNumber?.Phone}`} target="_blank" rel="noopener noreferrer">
                        <div className="flex border border-blue-950 justify-center rounded-full text-black text-sm font-heading gap-2 items-center px-3 py-1 sm:w-[120px]">
                          <FaWhatsapp className="text-[16px] text-green-500" />
                          Book Now
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className='h-[90px]'>
                    <div>
                      {pkg.price?.length > 0 ? (
                        <p className="text-[16px] text-blue-950 font-semibold">
                          <span>{pkg.price[0].round_trip_price>0? 'Single Trip Price:' : 'Price:'}</span>
                          {pkg?.discount ? (
                            (() => {
                              const discount = pkg.discount;
                              const hasAmountDiscount = discount?.discount_amount > 0;
                              const hasPercentDiscount = discount?.discount_percent > 0;
                              const hasAnyDiscount = hasAmountDiscount || hasPercentDiscount;
                              
                              let discountedPrice = pkg.price[0].price;
                              
                              if (hasAmountDiscount) {
                                discountedPrice = Math.floor(pkg.price[0].price - discount.discount_amount);
                              } 
                              else if (hasPercentDiscount) {
                                discountedPrice = Math.floor(pkg.price[0].price * (1 - (discount.discount_percent / 100)));
                              }
                              
                              return (
                                <>
                                  {hasAnyDiscount ? (
                                    <>
                                      <span className="line-through text-red-500 mr-1">
                                        {Math.floor(pkg.price[0].price)} TK
                                      </span>
                                      <span className="">
                                        {discountedPrice} TK
                                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                          {hasAmountDiscount 
                                            ? `${discount.discount_amount} TK OFF`
                                            : `${discount.discount_percent}% OFF`}
                                        </span>
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      {Math.floor(pkg.price[0].price)} TK
                                    </span>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            <span>
                              {Math.floor(pkg.price[0].price)} TK
                            </span>
                          )}
                          <span className="text-gray-500 text-[14px] ml-1">(Per person)</span>
                        </p>
                      ) : (
                        <p className="text-[15px] text-red-500">
                          Price: Not Available
                        </p>
                      )}
                    </div>

                    <div>
                      {pkg.price[0]?.round_trip_price > 0 ?  (
                        <p className="text-[16px] text-blue-950 font-semibold">
                          <span>Round Trip Price: </span>
                          {pkg?.discount ? (
                            (() => {
                              const discount = pkg.discount;
                              const hasAmountDiscount = discount?.discount_amount > 0;
                              const hasPercentDiscount = discount?.discount_percent > 0;
                              const hasAnyDiscount = hasAmountDiscount || hasPercentDiscount;
                              
                              let discountedPrice = pkg.price[0].round_trip_price;
                              
                              if (hasAmountDiscount) {
                                discountedPrice = Math.floor(pkg.price[0].round_trip_price - discount.discount_amount);
                              } 
                              else if (hasPercentDiscount) {
                                discountedPrice = Math.floor(pkg.price[0].round_trip_price * (1 - (discount.discount_percent / 100)));
                              }
                              
                              return (
                                <>
                                  {hasAnyDiscount ? (
                                    <>
                                      <span className="line-through text-red-500 mr-1">
                                        {Math.floor(pkg.price[0].round_trip_price)} TK
                                      </span>
                                      <span className="">
                                        {discountedPrice} TK
                                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                          {hasAmountDiscount 
                                            ? `${discount.discount_amount} TK OFF`
                                            : `${discount.discount_percent}% OFF`}
                                        </span>
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      {Math.floor(pkg.price[0].round_trip_price)} TK
                                    </span>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            <span>
                              {Math.floor(pkg.price[0].round_trip_price)} TK
                            </span>
                          )}
                          <span className="text-gray-500 text-[14px] ml-1">(Per person)</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {propertyPackages.length > 1 && (
        <>
          <button 
            className="property-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
            aria-label="Previous property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            className="property-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
            aria-label="Next property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default PackageCarousel;