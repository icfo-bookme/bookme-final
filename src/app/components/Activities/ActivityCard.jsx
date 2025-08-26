'use client';

import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { GiDiamondHard } from "react-icons/gi";
import Image from 'next/image';
import Link from 'next/link';

const ActivityCard = ({ activity }) => {
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

  // Function to render the appropriate icon based on icon_name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'IoLocationOutline':
        return <IoLocationOutline className="text-blue-500 text-xs" />;
      case 'FaRegClock':
        return <FaRegClock className="text-blue-500 text-xs" />;
      case 'PiUsersThree':
        return <PiUsersThreeBold className="text-blue-500 text-xs" />;
      case 'GoCommentDiscussion':
        return <GoCommentDiscussion className="text-blue-500 text-xs" />;
      case 'MdOutlineFreeCancellation':
        return <MdOutlineFreeCancellation className="text-blue-500 text-xs" />;
      case 'GiDiamondHard':
        return <GiDiamondHard className="text-blue-500 text-xs" />;
      default:
        return <FaRegClock className="text-blue-500 text-xs" />;
    }
  };

  return (
    <Link
      href={`/${slugify(activity.property_name)}/${activity.id}`}
      className="block"
    >
      <div className="group relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl  hover:shadow-sm transition-all duration-200 bg-white hover:border-blue-100">
        {/* activity Image */}
        <div className="relative w-full md:w-2/5 h-[12rem] rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${activity.image}`}
            alt={activity.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          {activity.discount && activity.discount > 0 && (
            <div className="absolute top-3 left-0 bg-[#FD7E14] text-white font-bold text-xs px-3 py-1 shadow-md z-10">
              <span className="relative z-10">{activity.discount}% OFF</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* activity Details */}
        <div className="flex flex-col justify-between w-full md:w-3/5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-blue-900 mb-1">{activity.property_name}</h3>
            </div>

            <div className="flex items-center text-sm text-gray-900 mb-3">
              <IoLocationOutline className="text-xs mr-2 text-blue-950" />
              <span>{activity.address}</span>
            </div>

            {/* activity Summary */}
            <div className="flex flex-wrap gap-2 mb-4">
              {activity.summaries && activity.summaries.slice(0, 4).map((summary, i) => (
                <span
                  key={i}
                  className="flex items-center text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="mr-2">
                    {renderIcon(summary.icon_name)}
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
              className="mt-3  md:mt-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              View Details
              <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </button>

            <div className="text-right mt-3 md:mt-0">
              <span className="text-xs text-gray-500 block">Starting From:</span>
              <div className="flex items-end justify-end gap-2">
                {activity.original_price && activity.original_price > (activity.price || 0) && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(activity.original_price)}
                  </p>
                )}
                <p className="text-xl font-bold text-blue-800">
                  {formatPrice(activity.price || 0)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">for entire package</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;