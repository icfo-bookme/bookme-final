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

const RoomCarousel = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(220);
  const [thumbsHeight, setThumbsHeight] = useState(80);
  const [thumbsPerView, setThumbsPerView] = useState(3);
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    maxWidth: "100%",
  });
  
  const swiperRef = useRef(null);
  const fullscreenSwiperRef = useRef(null);

 
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;

      const newCarouselHeight = isMobile ? 180 : 320;
      const newThumbsHeight = isMobile ? 60 : 90;
      const newThumbsPerView = isMobile ? 3 : isTablet ? 4 : 3;

      setCarouselHeight(newCarouselHeight);
      setThumbsHeight(newThumbsHeight);
      setThumbsPerView(newThumbsPerView);

      setContainerStyle({
        width: "100%",
        maxWidth: "100%"
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setFullscreenImage(images[index]);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
  };

  const handleFullscreenNavigation = (direction) => {
    if (!fullscreenSwiperRef.current) return;

    direction === "prev"
      ? fullscreenSwiperRef.current.slidePrev()
      : fullscreenSwiperRef.current.slideNext();
  };

  if (!images.length) {
    return (
      <div className="flex items-center justify-center" style={{ height: carouselHeight }}>
        <p className="text-center text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-full mx-auto bg-[#EBF0F4] ">
        {/* Main Carousel */}
        <div className="relative w-full max-w-[1200px]" style={containerStyle}>
          <Swiper
            loop={true}
            spaceBetween={2}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay, Pagination]}
            className="main-swiper"
            pagination={{ clickable: true }}
            style={{ height: carouselHeight }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id} onClick={() => openFullscreen(index)}>
                <div className="relative w-full h-full cursor-zoom-in" style={{ height: carouselHeight }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.image_path}`}
                    alt={`Hotel Image ${image.id}`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="100vw"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="w-full max-w-[1200px] mt-2 rounded-lg">
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={8}
            slidesPerView={thumbsPerView}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbnail-swiper"
            style={{ height: thumbsHeight }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-${image.id}`} onClick={() => openFullscreen(index)}>
                <div className="relative w-full h-full cursor-pointer" style={{ height: "100%" }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.image_path}`}
                    alt={`Thumbnail ${image.id}`}
                    fill
                    className="object-cover rounded-sm"
                    sizes="80px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          >
            ✕
          </button>

          <button
            onClick={() => handleFullscreenNavigation("prev")}
            className="absolute left-4 z-50 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => handleFullscreenNavigation("next")}
            className="absolute right-4 z-50 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <Swiper
            initialSlide={fullscreenIndex}
            loop={true}
            spaceBetween={10}
            modules={[Navigation]}
            className="fullscreen-swiper w-full h-full"
            onSwiper={(swiper) => {
              fullscreenSwiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setFullscreenIndex(swiper.realIndex);
              setFullscreenImage(images[swiper.realIndex]);
            }}
          >
            {images.map((image) => (
              <SwiperSlide key={`full-${image.id}`} className="flex items-center justify-center">
                <div className="relative w-full h-full max-w-[100vw] max-h-[90vh]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.image_path}`}
                    alt={`Fullscreen Image ${image.id}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default RoomCarousel;