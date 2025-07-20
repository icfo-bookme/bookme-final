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
  const [isMobile, setIsMobile] = useState(false);
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCarouselHeight(mobile ? 300 : 450);
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
    <div className="flex flex-col w-full">
      {/* Mobile View */}
      {isMobile && (
        <>
          <div className="relative w-full">
            <Swiper
              loop={true}
              spaceBetween={2}
              navigation={true}
              modules={[FreeMode, Navigation, Autoplay, Pagination]}
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
          </div>
          
          {/* Thumbnail Preview for Mobile */}
          <div className="w-full mt-2" style={{ height: 80 }}>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="thumbnail-swiper"
            >
              {propertyImages.map((image, index) => (
                <SwiperSlide key={`thumb-${image.id}`}>
                  <div 
                    className="relative w-full h-full cursor-pointer" 
                    style={{ height: 80 }}
                    onClick={() => {
                      if (swiperRef.current) {
                        swiperRef.current.slideTo(index);
                      }
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.photo}`}
                      alt={`Thumbnail ${image.id}`}
                      fill
                      className="object-cover rounded-sm border border-gray-200 hover:border-blue-500 transition-all"
                      sizes="80px"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <>
          <div className="flex flex-row w-full gap-4">
            {/* Main Image (2/3 width) */}
            <div className="w-full lg:w-2/3">
              <Swiper
                loop={true}
                spaceBetween={2}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className="main-swiper"
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
            </div>

            {/* Side Preview (1/3 width) */}
            <div className="hidden lg:flex lg:w-1/3 flex-col gap-2">
              {propertyImages.slice(0, 2).map((image, index) => (
                <div 
                  key={`preview-${image.id}`} 
                  className="relative cursor-pointer"
                  style={{ height: 'calc(50% - 4px)' }}
                  onClick={() => {
                    if (swiperRef.current) {
                      swiperRef.current.slideToLoop(index);
                    }
                  }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.photo}`}
                    alt={`Preview ${image.id}`}
                    fill
                    className="object-cover rounded-sm border border-gray-200 hover:border-blue-500 transition-all"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Preview for Desktop */}
          <div className="w-full mt-2" style={{ height: 100 }}>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs]}
              className="thumbnail-swiper"
            >
              {propertyImages.map((image, index) => (
                <SwiperSlide key={`thumb-${image.id}`}>
                  <div 
                    className="relative w-full h-full cursor-pointer" 
                    style={{ height: 100 }}
                    onClick={() => {
                      if (swiperRef.current) {
                        swiperRef.current.slideTo(index);
                      }
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image.photo}`}
                      alt={`Thumbnail ${image.id}`}
                      fill
                      className="object-cover rounded-sm border border-gray-200 hover:border-blue-500 transition-all"
                      sizes="100px"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </div>
  );
};

export default HotelCarousel;