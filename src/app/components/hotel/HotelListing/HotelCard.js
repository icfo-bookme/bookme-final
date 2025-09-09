'use client';

import Image from 'next/image';
import Link from 'next/link';

const HotelCard = ({
  hotel,
  amenities,
  checkin,
  checkout,
  rooms,
  adult,
  isHighlighted,
}) => {
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
      href={`/hotel/list/details/${slugify(hotel.name)}/${hotel.id}?checkin=${checkin}&checkout=${checkout}&rooms=${rooms}&adult=${adult}`}
      className="block"
    >
      <div className={`group relative flex flex-col md:flex-row gap-5 p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${isHighlighted ? 'bg-yellow-100' : 'bg-white'
        } hover:border-blue-100`}
      >
        {/* Hotel Image */}
        <div className="relative w-full md:w-2/5 h-52 rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${hotel.img}`}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={false}
          />
          {hotel.discount && hotel.discount > 0 && (
            <div className="absolute top-3 left-0 bg-[#FD7E14] text-white font-bold text-xs px-3 py-1 shadow-md z-10">
              <span className="relative z-10">{hotel.discount}% OFF</span>

            </div>
          )}
          {hotel.label && (
            <div className="absolute top-10 rounded-r-lg bg-white text-blur-950 font-bold text-sm px-2 py-1 shadow-md z-10">
              <i className="fa-solid fa-fire"></i> <span className="relative z-10">{hotel.label}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>

        {/* Hotel Details */}
        <div className="flex flex-col justify-between w-full md:w-3/5">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-blue-900 mb-1">{hotel.name}</h3>
              <div className="flex md:w-[90px] items-center bg-blue-50 px-2 py-1 rounded-md">
                <i className="fa-solid fa-star text-yellow-400 text-sm mr-1"></i>
                <span className="text-sm hidden md:block font-medium">{hotel.star} star</span>
                <span className="md:hidden text-sm font-medium">{hotel.star} </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-3">
              <i className="fa-solid fa-location-dot text-xs mr-2"></i>
              <span>{hotel.location}</span>
            </div>

            {/* Amenities */}
            {(hotel.summary?.length > 0 || hotel.facilities?.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...(hotel.summary || []), ...(hotel.facilities || [])]
                  .slice(0, 6)
                  .filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                  )
                  .map((amenity) => {
                    const amenityData = amenities.find(a => a.id === amenity.id);
                    return (
                      <span
                        key={amenity.id}
                        className="flex items-center text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        {amenityData?.icon_class && (
                          <i className={`${amenityData.icon_class} mr-2 text-blue-600 text-xs`}></i>
                        )}
                        {amenityData?.name || amenity.name}
                      </span>
                    );
                  })}
                {(hotel.summary?.length + hotel.facilities?.length) > 6 && (
                  <span className="text-xs bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                    +{(hotel.summary?.length || 0) + (hotel.facilities?.length || 0) - 6} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-gray-100">
            <div>
              {hotel.extra_discount_msg && (
                <p className="text-xs text-green-600 font-medium mb-1">{hotel.extra_discount_msg}</p>
              )}
              <span className="text-xs text-gray-500">Starting From:</span>
              <div className="flex items-end gap-2">
                {hotel.hasPrice ? (
                  <>
                    <p className="text-xl font-bold text-blue-800">
                      {formatPrice(hotel.price_after_discount)}
                    </p>
                    {hotel.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(hotel.regular_price)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-blue-600">Contact for price</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">for per Night, per room</p>
            </div>

            <button
              style={{
                background: "linear-gradient(90deg, #313881, #0678B4)",
              }}
              className="mt-3 md:mt-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              View Details
              <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;