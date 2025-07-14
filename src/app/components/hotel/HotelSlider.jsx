"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import getHotelPhotos from "@/services/hotel/getHotelPhotos";

const HotelCarousel = ({ hotelId }) => {
  const [propertyImages, setPropertyImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [carouselHeight, setCarouselHeight] = useState(450);
  const [thumbsHeight, setThumbsHeight] = useState(100);
  const [thumbsDirection, setThumbsDirection] = useState("vertical");
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    maxWidth: "100%",
  });
  const [thumbnailStyle, setThumbnailStyle] = useState({
    maxWidth: "100%",
    width: "100%",
  });

  const swiperRef = useRef(null);

  // Fetch images when hotelId changes
  useEffect(() => {
    const fetchImages = async () => {
      if (!hotelId) {
        setError("Hotel ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const images = await getHotelPhotos(hotelId);
        setPropertyImages(images || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load images:", err);
        setError("Failed to load images");
        setPropertyImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [hotelId]);

  // Responsive layout handler
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      const isDesktop = window.innerWidth >= 1024;

      // Set heights
      const newCarouselHeight = isMobile ? 300 : 450;
      const newThumbsHeight = isMobile ? 80 : isTablet ? 100 : 450;

      setCarouselHeight(newCarouselHeight);
      setThumbsHeight(newThumbsHeight);

      // Layout styles
      setContainerStyle({
        width: isDesktop ? "80%" : "100%",
        maxWidth: isDesktop ? "80%" : "100%"
      });

      setThumbnailStyle({
        maxWidth: isDesktop ? "20%" : "100%",
        width: isDesktop ? "20%" : "100%",
        height: isMobile ? `${newThumbsHeight}px` : "auto"
      });

      // Thumbs direction
      setThumbsDirection(isDesktop ? "vertical" : "horizontal");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize autoplay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: carouselHeight }}>
        <p className="text-center text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: carouselHeight }}>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!propertyImages.length) {
    return (
      <div className="flex items-center justify-center" style={{ height: carouselHeight }}>
        <p className="text-center text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex lg:flex-row flex-col items-start gap-4 mx-auto bg-[#EBF0F4]" style={{ maxWidth: "100%" }}>
      {/* Main Carousel */}
      <div className="relative" style={containerStyle}>
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
          {propertyImages.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative w-full h-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.photo}`}
                  alt={`Hotel Image ${image.id}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex-shrink-0" style={thumbnailStyle}>
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={thumbsDirection === "horizontal" ? 4 : 4}
          freeMode={true}
          direction={thumbsDirection}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbnail-swiper"
          style={{ 
            height: thumbsHeight,
            padding: thumbsDirection === "horizontal" ? "10px 0" : "0 10px"
          }}
        >
          {propertyImages.map((image) => (
            <SwiperSlide key={`thumb-${image.id}`}>
              <div 
                className="relative w-full h-full cursor-pointer" 
                style={{ 
                  height: thumbsDirection === "horizontal" ? "100%" : "100%",
                  padding: "2px"
                }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.photo}`}
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
  );
};

export default HotelCarousel;