'use client';
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock, FaUsers, FaCommentDots } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { GiDiamondHard } from "react-icons/gi";
import { RiUserVoiceLine } from "react-icons/ri";
import { TbClock, TbUsers } from "react-icons/tb";
import { BiTime, BiUserVoice } from "react-icons/bi";
import { AiOutlineUser, AiOutlineClockCircle } from "react-icons/ai";
import Image from 'next/image';
import Link from 'next/link';


const iconMapping = {
  IoLocationOutline: IoLocationOutline,
  FaRegClock: FaRegClock,
  TbClock: TbClock,
  BiTime: BiTime,
  AiOutlineClockCircle: AiOutlineClockCircle,
  PiUsersThreeBold: PiUsersThreeBold,
  PiUsersThree: PiUsersThreeBold,
  FaUsers: FaUsers,
  TbUsers: TbUsers,
  AiOutlineUser: AiOutlineUser,
  GoCommentDiscussion: GoCommentDiscussion,
  FaCommentDots: FaCommentDots,
  RiUserVoiceLine: RiUserVoiceLine,
  BiUserVoice: BiUserVoice,
  MdOutlineFreeCancellation: MdOutlineFreeCancellation,
  GiDiamondHard: GiDiamondHard,
  default: FaRegClock
};

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


  const formatTimeDisplay = (timeString) => {
    if (!timeString) return '';

    return timeString
      .replace(/\b0h\s?/g, '')
      .replace(/\s0m\b/g, '')
      .replace(/\s+to\s+/, ' to ');
  };

  const renderIcon = (iconName) => {

    const cleanIconName = iconName ? iconName.replace(/['"]/g, '').trim() : '';
    const IconComponent = iconMapping[cleanIconName] || iconMapping.default;
    return <IconComponent className="text-blue-500 text-xs" />;
  };


  const getSummaryText = (summary) => {
    const validKeys = Object.keys(summary).filter(key =>
      key !== 'icon_name' &&
      key !== 'icon_import' &&
      summary[key] &&
      summary[key].trim() !== ''
    );

    if (validKeys.length > 0) {
      const text = summary[validKeys[0]];
      if (validKeys[0] === 'Duration' || text.includes('h') || text.includes('m')) {
        return formatTimeDisplay(text);
      }
      return text;
    }

    return '';
  };

  const getSummaryKey = (summary) => {
    const validKeys = Object.keys(summary).filter(key =>
      key !== 'icon_name' &&
      key !== 'icon_import' &&
      summary[key] &&
      summary[key].trim() !== ''
    );

    return validKeys.length > 0 ? validKeys[0] : '';
  };

  return (
    <Link
      href={`/${slugify(activity.property_name)}/${activity.id}`}
      className="block"
    >
      <div className="group relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl  hover:shadow-sm transition-all duration-200 bg-white hover:border-blue-100">
        <div className="relative w-full md:w-2/5 h-[13rem] rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${activity.image}`}
            alt={activity.property_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          {activity.discount_percent && parseFloat(activity.discount_percent) > 0 && (
            <div className="absolute top-3 left-0 bg-[#FD7E14] text-white font-bold text-xs px-3 py-1 shadow-md z-10">
              <span className="relative z-10">{activity.discount_percent}% OFF</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

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
              {activity.summaries && activity.summaries.slice(0, 4).map((summary, i) => {
                const summaryText = getSummaryText(summary);
                const summaryKey = getSummaryKey(summary);
                if (!summaryText) return null;

                return (
                  <span
                    key={i}
                    className="flex items-start text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    title={summaryKey}
                  >
                    <div className="mr-2">
                      {renderIcon(summary.icon_name)}
                    </div>
                    {summaryText}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex  md:flex-row items-start  justify-between pt-1 border-t border-gray-100">
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

              {parseFloat(activity.final_price || activity.price || 0) > 0 ? (
                <div className="flex items-end justify-end gap-2">
                  {activity.original_price &&
                    parseFloat(activity.original_price) >
                    parseFloat(activity.final_price || activity.price || 0) && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(activity.original_price)}
                      </p>
                    )}
                  <p className="text-xl font-bold text-blue-800">
                    {formatPrice(activity.final_price || activity.price)}
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

export default ActivityCard;