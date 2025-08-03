"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { Raleway } from "next/font/google";
import Header from "../../shared/Header/Header";

const raleway = Raleway({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Banner({id}) {
  const [terms, setTerms] = useState([]);
  
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/carousel-slider/destination/${id}`);
        const data = await response.json();
        setTerms(data);
      } catch (error) {
        console.error('Error fetching Carousel Image:', error);
      }
    };
    
    fetchTerms();
  }, []);

  return (
    <section className={`${raleway.className} relative z-10 h-[30vh] lg:h-[60vh]`}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full"
      >
        {terms?.map((image, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            <div className="relative h-full w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${image?.image}`}
                alt={`Slide ${index}`}
                fill
                className="object-cover"
                priority={index === 0}
                style={{width:"100%", height:"100%"}}
              />
            </div>
            
            {/* Content Overlay - now inside SwiperSlide */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none"></div>

            {/* Text Content - now using image-specific data */}
            <div className="absolute inset-0 flex items-center h-full px-4 md:px-8 z-20 pointer-events-none">
              <div className="font-heading text-white w-full lg:w-3/5 space-y-6 pl-8 lg:pl-16 text-left">
                <h4 className="sm:text-3xl text-[20px] lg:text-4xl font-bold mb-4">
                  {image?.title || "Plan tours to dream locations in just a click!"}
                </h4>
                <p className="text-[12px] sm:text-[16px]">
                  {image?.subtitle || "Travel is a transformative and enriching experience that allows individuals to explore new destinations, cultures, and landscapes."}
                </p>
               
              </div>
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}