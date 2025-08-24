"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const PropertySlider = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const [carouselHeight, setCarouselHeight] = useState(450);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setCarouselHeight(mobile ? 300 : 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mainSwiperRef.current) {
        mainSwiperRef.current.autoplay.start();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: carouselHeight }}>
        <p className="text-center text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Main + Right-side preview */}
      
      <div className="flex flex-col lg:flex-row w-full gap-2">
        {/* Main Swiper */}
        <div className="w-full lg:w-2/3">
          <Swiper
            loop={true}
            spaceBetween={2}
            navigation={true}
            thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
            modules={[FreeMode, Navigation, Thumbs, Autoplay, Pagination]}
            className="main-swiper"
            style={{ height: carouselHeight }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`image-${index}`}>
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image}`}
                    alt={`Property Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right-Side Previews */}
        <div className="hidden lg:flex lg:w-1/3 flex-col gap-2">
          {images.slice(0, 2).map((image, index) => {
            const isLast = index === 1 && images.length > 2;
            return (
              <div
                key={`preview-${index}`}
                className="relative cursor-pointer group"
                style={{ height: "calc(50% - 4px)" }}
                onClick={() => {
                  if (mainSwiperRef.current) {
                    mainSwiperRef.current.slideToLoop(index);
                  }
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image}`}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-all"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Thumbnails */}
      <div className="w-full mt-2" style={{ height: isMobile ? 80 : 100 }}>
        <Swiper
          onSwiper={(swiper) => {
            setThumbsSwiper(swiper);
            thumbsSwiperRef.current = swiper;
          }}
          loop={true}
          spaceBetween={10}
          slidesPerView={isMobile ? 4 : 6}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="thumbnail-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`thumb-${index}`}>
              <div
                className="relative w-full h-full cursor-pointer"
                style={{ height: isMobile ? 80 : 100 }}
                onClick={() => {
                  if (mainSwiperRef.current) {
                    mainSwiperRef.current.slideTo(index);
                  }
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-all"
                  sizes="100px"
                />
                {(isMobile && index === 3 && images.length > 4) ||
                  (!isMobile && index === 5 && images.length > 6) ? (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-sm">
                    <span className="text-white text-sm md:text-xl font-semibold">
                      +{images.length - (isMobile ? 4 : 6)} more
                    </span>
                  </div>
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PropertySlider;