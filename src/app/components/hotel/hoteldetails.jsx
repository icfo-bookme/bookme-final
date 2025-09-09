'use client'

import { FaCheck } from "react-icons/fa";

export default function HotelDetails({ hotel }) {
    
    const nearbyLocations = hotel.near_by
        ? hotel.near_by.split('|').map(loc => loc.trim()).filter(loc => loc)
        : [];
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="container mx-auto">
                <h1 className="text-xl text-blue-950 font-bold">{hotel.name}</h1>
                <div className='flex pt-1 flex-wrap items-center gap-2 md:gap-5 text-xs md:text-sm text-gray-600'>
                    <div className='border border-gray-400 px-1 rounded-lg flex items-center gap-1'>
                        <i className="fa-solid fa-star text-yellow-400 text-sm mr-1"></i>
                        <span>{hotel.star} star</span>
                    </div>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-gray-600 text-xs"></i>
                        <span>{hotel.location}</span>
                    </p>
                </div>

                {/* Nearby locations section */}
                {nearbyLocations.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-sm font-semibold text-blue-950 mb-2">Nearby Locations:</h3>
                        <ul className="text-xs text-gray-600 space-y-1 ml-3">
                            {nearbyLocations.map((location, index) => (
                                <li key={index} className="flex items-start gap-1 ">
                                    <i className="fa-solid fa-location-dot text-gray-600 text-sm"></i>
                                    <span className="text-gray-600">{location}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hotel.summary && hotel.summary.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-xl font-bold text-blue-950 mb-1">Amenities:</h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                            {hotel.summary.slice(0, 6).map((amenity) => (
                                <span
                                    key={amenity.id}
                                    className="flex items-center text-xs md:text-xs text-blue-950 bg-gray-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full"
                                >

                                    {amenity.icon_class ? (
                                        <i
                                            className={`${amenity.icon_class} text-blue-500 text-sm w-4 flex justify-center mr-1`}
                                        />
                                    ) : (
                                        <FaCheck className="text-blue-500 text-sm mr-1" />
                                    )}

                                    {amenity.name}
                                </span>
                            ))}


                            {hotel.summary.length > 6 && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                    +{hotel.summary.length - 6} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}