import PrimaryButton from "@/utils/PrimaryButton"
import Image from "next/image"
import Link from "next/link"
import { FaMapMarkerAlt, FaPlane, FaPlaneDeparture } from "react-icons/fa"
import { RiWhatsappFill } from "react-icons/ri"

export const Card = ({ flightRoutes, homepage }) => {
    // Determine which routes to display
    const displayRoutes = homepage === 'true'
        ? flightRoutes?.slice(0, 6)
        : flightRoutes;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">


                {displayRoutes?.map(route => (
                    <div key={route.id} className="bg-white hover:border hover:border-blue-950 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100">
                        <div className="px-3 py-6">
                            <div className="flex flex-col items-center justify-between">
                                <div className="flex justify-between w-full">
                                    <div className="text-left w-2/5">
                                        <h3 className="text-base font-bold text-slate-800 truncate">{route.origin_city}</h3>
                                        <div className="flex items-center text-slate-500 text-xs mt-1">
                                            <FaMapMarkerAlt size={10} className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{route.origin_airport_name}</span>
                                        </div>
                                    </div>

                                    <div className="text-right w-2/5">
                                        <h3 className="text-base font-bold text-slate-800 truncate">{route.destination_city}</h3>
                                        <div className="flex items-center justify-end text-slate-500 text-xs mt-1">
                                            <FaMapMarkerAlt size={10} className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{route.destination_airport_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative -top-[52px] right-2 mx-auto w-[50%] flex items-center justify-center">
                                    <span className="font-semibold -mt-5 text-blue-700 text-[8px] md:text-xs">{route.flight_duration}</span>
                                    <div className="h-0.5 bg-blue-200 w-[calc(100%-1rem)] mx-auto absolute top-1/2 transform -translate-y-1/2"></div>

                                    <div className="relative bg-white px-2 z-10">
                                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <FaPlaneDeparture className="text-white transform " size={16} />
                                        </div>
                                    </div>
                                    <span className="font-semibold -mt-5 text-blue-700 text-[8px] md:text-xs">{route.number_of_stops === "0" ? "Non-stop" : `${route.number_of_stops} stop${route.number_of_stops > 1 ? 's' : ''}`}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center pt-1 border-t border-slate-100 mt-0 ">
                                <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
                                    {route.airline_icon_url ? (
                                        <div className="relative h-8 w-8 sm:h-10 sm:w-10 mr-3">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${route.airline_icon_url}`}
                                                alt={`${route.airline_name || 'Airline'} logo`}
                                                fill
                                                className="object-contain rounded-lg"
                                                sizes="(max-width: 640px) 32px, 40px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <FaPlane className="text-blue-600" size={14} />
                                        </div>
                                    )}

                                    <div className="flex-1 sm:flex-none">
                                        <div className="text-xs text-slate-500 font-medium mb-1">Starting from</div>
                                        <div className="flex items-baseline flex-wrap">
                                            {route.discount_percent > 0 ? (
                                                <>
                                                    <span className="text-lg sm:text-xl font-bold text-slate-800">
                                                        {Math.round(route.base_price * (1 - route.discount_percent / 100)).toFixed(2)}
                                                    </span>
                                                    <span className="ml-2 text-xs sm:text-sm text-slate-500 line-through">{Math.round(route.base_price)} TK</span>
                                                </>
                                            ) : (
                                                <span className="text-lg sm:text-xl font-bold text-slate-800">{Math.round(route.base_price)} TK</span>
                                            )}

                                            {route.discount_percent > 0 && (
                                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full">
                                                    Save {route.discount_percent}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Price per person • Includes taxes & fees</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">
                                    <a
                                        href="https://wa.me/880196777677"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto"
                                    >
                                        <PrimaryButton className="flex items-center justify-center whitespace-nowrap text-sm py-2.5 px-5 shadow-md hover:shadow-lg w-full sm:w-auto">
                                            Book Now
                                            <RiWhatsappFill size={20} className="ml-2 text-green-200 " />
                                        </PrimaryButton>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


            </div>
            {homepage === 'true' && (
                <div className="w-full flex justify-center mt-8 md:mt-10">
                    <Link
                        href="/flight"
                        style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                        className="px-3 py-1 md:px-8 md:py-3.5 text-white font-medium rounded-md hover:opacity-90 transition-opacity inline-flex items-center"
                    >
                        See More
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                            <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            )}

            {flightRoutes?.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-md col-span-full">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPlane className="text-blue-600" size={32} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No flight routes available</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        There are no flight routes available at the moment. Please check back later for updates.
                    </p>
                </div>
            )}
        </div>
    )
}