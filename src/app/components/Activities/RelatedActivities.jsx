import React from "react";
import Image from "next/image";

// Import all used icons
import { FaRegClock } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbWorldPlus } from "react-icons/tb";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

const iconMap = {
    FaRegClock: <FaRegClock className="text-blue-500 text-lg" />,
    PiUsersThree: <PiUsersThreeBold className="text-green-600 text-lg" />,
    TbWorldPlus: <TbWorldPlus className="text-purple-500 text-lg" />,
    MdOutlineFreeCancellation: <MdOutlineFreeCancellation className="text-red-500 text-lg" />,
};

const RelatedActivities = ({ packages = [] }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h1 className="col-span-full text-2xl font-bold text-gray-800">Related Activities</h1>
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-100"
                >
                    <div className="relative w-full h-48">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.image}`}
                            alt={pkg.id}
                            fill
                            className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 30vw, 25vw"
                        />
                        {pkg.discount_percent > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {pkg.discount_percent}% OFF
                            </div>
                        )}
                    </div>

                    <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
                            {pkg.property_name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">{pkg.address}</p>

                        <div className="mb-4 space-y-2">
                            {pkg.summaries?.map((summary, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    {iconMap[summary.icon_name] || null}
                                    <span>{summary.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-4 mb-3">
                            <div className="flex items-center">
                                <span className="text-lg font-bold text-indigo-600">
                                    ৳{parseFloat(pkg.final_price).toLocaleString()}
                                </span>
                                {pkg.discount_percent > 0 && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                        ৳{parseFloat(pkg.price).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors group">
                                See Details
                                <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RelatedActivities;