'use client';

import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import Image from 'next/image';
import Link from 'next/link';

const TourCard = ({ tour }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(price).replace('BDT', 'BDT ');
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  return (
    <Link
      href={`/${slugify(tour.property_name)}/${tour.id}`}
      className="block"
    >
      <div className="group relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl  hover:shadow-sm transition-all duration-200 bg-white hover:border-blue-100">
        {/* Tour Image */}
        <div className="relative w-full md:w-2/5 h-[15rem] rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${tour.image}`}
            alt={tour.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          {tour.discount && tour.discount > 0 && (
            <div className="absolute top-3 left-0 bg-[#FD7E14] text-white font-bold text-xs px-3 py-1 shadow-md z-10">
              <span className="relative z-10">{tour.discount}% OFF</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* Tour Details */}
        <div className="flex flex-col justify-between w-full md:w-3/5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-blue-900 mb-1">{tour.property_name}</h3>
              {/* <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                <i className="fa-solid fa-star text-yellow-400 text-sm mr-1"></i>
                <span className="text-sm font-medium">Package</span>
              </div> */}
            </div>

            <div className="flex items-center text-sm text-gray-900 mb-3">
              <IoLocationOutline className="text-xs mr-2 text-blue-950" />
              <span>{tour.address}</span>
            </div>

            {/* Tour Summary */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.summaries.slice(1, 4).map((summary, i) => (
                <span
                  key={i}
                  className="flex items-center text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="mr-2">
                    {summary.icon_name === 'IoLocationOutline' && <IoLocationOutline className="text-blue-500 text-xs" />}
                    {summary.icon_name === 'FaRegClock' && <FaRegClock className="text-blue-500 text-xs" />}
                    {summary.icon_name === 'PiUsersThree' && <PiUsersThreeBold className="text-blue-500 text-xs" />}
                    {summary.icon_name === 'GoCommentDiscussion' && <GoCommentDiscussion className="text-blue-500 text-xs" />}
                  </div>
                  {summary.value}
                </span>
              ))}
            </div>
          </div>

          {/* Price and CTA - Updated layout with price on right */}
          <div className="flex  md:flex-row md:items-center justify-between pt-1 border-t border-gray-100">
            <button
              style={{
                background: "linear-gradient(90deg, #313881, #0678B4)",
              }}
              className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              View Details
              <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </button>

            <div className="text-right">
              <span className="text-xs text-gray-500 block">Starting From:</span>

              {tour.price && tour.price > 0 ? (
                <div className="flex items-end justify-end gap-2">
                  {tour.original_price && tour.original_price > tour.price && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(tour.original_price)}
                    </p>
                  )}
                  <p className="text-xl font-bold text-blue-800">
                    {formatPrice(tour.price)}
                  </p>
                </div>
              ) : (
                <p className="text-base text-blue-500 mt-1">Contact for price</p>
              )}

              <p className="text-xs text-gray-500 mt-1">for entire package</p>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;