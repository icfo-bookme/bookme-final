"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Roboto } from "next/font/google";
import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Banner() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoData = {
    title: "Plan to dream locations in just a click!",
  };

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.log("Autoplay prevented, showing fallback:", error);
            setIsPlaying(false);
          });
      }
    };

    playVideo();
  }, []);

  return (
    <section className={`${raleway.className} relative z-10 h-[40vh] lg:h-[42vh]`}>
      <div className="relative h-full w-full overflow-hidden">
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        >
          <source src="/banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none"></div>

      </div>
    </section>
  );
}