'use client';
import { useState, useEffect, useRef } from "react";
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
import getContactNumber from "@/services/tour/getContactNumber";
import getPopularSummary from "@/services/tour/getPopularSummary";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function SaintMartin() {
    const [data, setData] = useState([]);
    const [contactNumber, setContactNumber] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const swiperRef = useRef(null);
    const touchTimeoutRef = useRef(null);

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

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const locationId = 3;
                const result = await getPopularSummary(locationId);
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchContactNumber() {
            try {
                const result = await getContactNumber();
                setContactNumber(result);
            } catch (err) {
                console.error("Error fetching contact number:", err);
            }
        }
        fetchContactNumber();
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
            }, 3000);
        }
    };

    return (
        <div className={`${roboto.className} bg-white w-full mx-auto max-w-7xl`}>
            <div className="w-full text-center mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-[#00026E] mb-2">
                    Popular Saintmartin Ships
                </h2>
                <div className="w-20 h-1 bg-[#0678B4] mx-auto"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <TailSpin height="60" width="60" color="#0678B4" ariaLabel="loading" />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">
                    Error loading ships: {error}
                </div>
            ) : data && data.length > 0 ? (
                <div className="relative">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Pagination, Autoplay, FreeMode]}
                        spaceBetween={16}
                        slidesPerView={1}
                        centeredSlides={true}
                        loop={true}
                        initialSlide={1}
                        speed={isMobile ? 1000 : 1000}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.property-swiper-button-next',
                            prevEl: '.property-swiper-button-prev',
                        }}
                        freeMode={{
                            enabled: isMobile,
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
                        breakpoints={{
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
                                slidesPerGroup: 3,
                                speed: 700,
                                freeMode: false,
                            },
                            1280: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                speed: 800,
                                freeMode: false,
                            }
                        }}
                        className="w-full md:w-[90%] lg:w-[89%] mx-auto"
                    >
                        {data.slice(0, 12).map((property) => (
                            <SwiperSlide key={property.property_id} className=" h-auto">
                                <div className="relative rounded-xl overflow-hidden shadow-lg h-full group flex flex-col">
                                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
                                            alt={property.property_name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            priority={property.property_id < 3}
                                        />
                                    </div>
                                    <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                                        <Link href={`/Property/${property.property_id}`} className="cursor-pointer">
                                            <h3 className="text-lg md:text-xl h-12 font-bold text-[#00026E] mb-2 hover:text-blue-700 transition-colors line-clamp-2">
                                                {property.property_name}
                                            </h3>
                                        </Link>

                                        <div className="mt-auto pt-4">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs sm:text-sm text-gray-600">
                                                        Starting from
                                                    </span>
                                                    <span className="font-bold text-lg sm:text-xl text-blue-900">
                                                        {(() => {
                                                            const prices =
                                                                property.property_uinit?.flatMap((unit) =>
                                                                    unit.price?.map((priceObj) => priceObj.price)
                                                                ) || [];
                                                            return prices.length > 0
                                                                ? `${Math.min(...prices).toLocaleString()} TK`
                                                                : "N/A";
                                                        })()}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/Property/${property.property_id}`}
                                                    style={{
                                                        background: "linear-gradient(90deg, #313881, #0678B4)",
                                                    }}
                                                    className="text-sm px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center"
                                                >
                                                    See Details
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                                                        <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <button className="property-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button className="property-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* See More Button */}
                    <div className="w-full flex justify-center mt-8 md:mt-10">
                        <Link
                            href="/tour/3"
                            style={{
                                background: "linear-gradient(90deg, #313881, #0678B4)",
                            }}
                            className="px-3 py-1 md:px-8 md:py-3.5 text-white font-medium rounded-md hover:opacity-90 transition-opacity inline-flex items-center"
                        >
                            See More
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-[200px]">
                    <p className="text-gray-600 text-base sm:text-lg">No ships available at the moment.</p>
                </div>
            )}
        </div>
    );
}