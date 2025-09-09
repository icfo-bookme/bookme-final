"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbWorldPlus } from "react-icons/tb";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

const iconSize = "text-base";

const iconMap = {
    FaRegClock: <FaRegClock className={`text-blue-500 ${iconSize}`} />,
    PiUsersThree: <PiUsersThreeBold className={`text-green-600 ${iconSize}`} />,
    TbWorldPlus: <TbWorldPlus className={`text-purple-500 ${iconSize}`} />,
    MdOutlineFreeCancellation: <MdOutlineFreeCancellation className={`text-red-500 ${iconSize}`} />,
};

// Slugify utility
const slugify = (text = "") =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");


const formatDuration = (value) => {
    if (!value) return "";
    const parts = value.split(" ");
    return parts
        .filter((part) => !part.startsWith("0")) 
        .join(" ")
        .trim();
};

const RelatedActivities = ({ packages = [] }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h1 className="col-span-full text-2xl font-bold text-gray-800">Related Activities</h1>

            {packages.map((pkg) => (
                <Link href={`/${slugify(pkg.property_name)}/${pkg.id}`} key={pkg.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-100 group">
                        <div className="relative w-full h-48">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${pkg.image}`}
                                alt={pkg.property_name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
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

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {pkg.summaries?.slice(0, 2).map((summary, index) => {
                                    const isClock = summary.icon_name === "FaRegClock";
                                    const value = isClock ? formatDuration(summary.value) : summary.value;
                                    if (!value) return null;

                                    return (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                            <span className="w-5 h-5 flex items-center justify-center">
                                                {iconMap[summary.icon_name] || null}
                                            </span>
                                            <span>{value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className=" gap-4 mb-4">
                                {pkg.summaries?.slice(2, 4).map((summary, index) => {
                                    const isClock = summary.icon_name === "FaRegClock";
                                    const value = isClock ? formatDuration(summary.value) : summary.value;
                                    if (!value) return null;

                                    return (
                                        <div key={index} className="flex  gap-2 text-sm text-gray-700">
                                            <span className="w-5 h-5 flex items-center justify-center">
                                                {iconMap[summary.icon_name] || null}
                                            </span>
                                            <span>{value}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-4 mb-3">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-indigo-600">
                                        {parseFloat(pkg.final_price).toLocaleString()} BDT
                                    </span>
                                    {pkg.discount_percent > 0 && (
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                            {parseFloat(pkg.price).toLocaleString()} BDT
                                        </span>
                                    )}
                                </div>

                                <button
                                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                                    className="flex items-center text-white px-3 py-1.5 rounded hover:opacity-90 text-sm font-medium transition-colors group"
                                >
                                    See Details
                                    <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RelatedActivities;
