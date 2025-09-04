import PrimaryButton from "@/utils/PrimaryButton"
import Image from "next/image"
import Link from "next/link"
import { FaMapMarkerAlt, FaPlane, FaPlaneDeparture } from "react-icons/fa"
import { RiWhatsappFill } from "react-icons/ri"


export const Card = ({ flightRoutes }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {flightRoutes?.map(route => (
                    <div key={route.id} className="bg-white hover:border hover:border-blue-950 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-100">
                        <div className="p-6">
                            {/* Main route information with cities on sides */}
                            <div className="flex flex-col items-center justify-between">
                                <div className="flex justify-between w-full">
                                    {/* Origin city */}
                                    <div className="text-left w-2/5">
                                        <h3 className="text-lg font-bold text-slate-800 truncate">{route.origin_city}</h3>
                                        <div className="flex items-center text-slate-500 text-xs mt-1">
                                            <FaMapMarkerAlt size={10} className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{route.origin_airport_name}</span>
                                        </div>
                                    </div>

                                    {/* Destination city */}
                                    <div className="text-right w-2/5">
                                        <h3 className="text-lg font-bold text-slate-800 truncate">{route.destination_city}</h3>
                                        <div className="flex items-center justify-end text-slate-500 text-xs mt-1">
                                            <FaMapMarkerAlt size={10} className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{route.destination_airport_name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Flight path visualization */}
                                <div className="relative -top-[52px] mx-auto w-[50%] flex items-center justify-center">
                                    <span className="font-semibold -mt-5 text-blue-700 text-sm">{route.flight_duration}</span>
                                    <div className="h-0.5 bg-blue-200 w-full mx-auto absolute top-1/2 transform -translate-y-1/2"></div>

                                    <div className="relative bg-white px-2 z-10">
                                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <FaPlaneDeparture className="text-white transform " size={16} />
                                        </div>
                                    </div>
                                    <span className="font-semibold -mt-5 text-blue-700 text-sm">{route.number_of_stops === "0" ? "Non-" : `${route.number_of_stops}`} stop</span>
                                </div>
                            </div>

                            {/* Additional details and pricing */}
                            <div className="flex flex-col md:flex-row justify-between items-center  border-t border-slate-100">
                                <div className="flex items-center mb-4 md:mb-0">
                                    {route.airline_icon_url ? (
                                        <div className="relative h-10 w-10 mr-3">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${route.airline_icon_url}`}
                                                alt={`${route.airline_name || 'Airline'} logo`}
                                                fill
                                                className="object-contain rounded-lg"
                                                sizes="40px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <FaPlane className="text-blue-600" size={18} />
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-xs text-slate-500 font-medium mb-1">Starting from</div>
                                        <div className="flex items-baseline flex-wrap">
                                            {route.discount_percent > 0 ? (
                                                <>
                                                    <span className="text-xl font-bold text-slate-800">
                                                        ${(route.base_price * (1 - route.discount_percent / 100)).toFixed(2)}
                                                    </span>
                                                    <span className="ml-2 text-sm text-slate-500 line-through">${route.base_price}</span>
                                                </>
                                            ) : (
                                                <span className="text-xl font-bold text-slate-800">${route.base_price}</span>
                                            )}

                                            {route.discount_percent > 0 && (
                                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                    Save {route.discount_percent}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Price per person • Includes taxes & fees</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <a
                                        href="https://wa.me/8801967776777"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <PrimaryButton className="flex items-center whitespace-nowrap text-sm py-2.5 px-5 shadow-md hover:shadow-lg">
                                            Book Now
                                            <RiWhatsappFill size={24} className="ml-2 text-green-500" />
                                        </PrimaryButton>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
