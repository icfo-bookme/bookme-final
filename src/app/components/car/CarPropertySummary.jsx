'use client';
import { useState, useEffect, useRef } from 'react';
import * as IoIcons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import * as GoIcons from "react-icons/go";
import * as MdIcons from "react-icons/md"; // Added for MdEventSeat
import { FaLocationDot } from 'react-icons/fa6';
import Link from 'next/link';

export default function CarPropertySummary({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    if (!data) {
        return <div>No property summary available</div>;
    }

    // Function to dynamically get icon component
    const getIcon = (iconName) => {
        return (
            IoIcons[iconName] ||
            FaIcons[iconName] ||
            PiIcons[iconName] ||
            GoIcons[iconName] ||
            MdIcons[iconName] || // Added MdIcons
            null
        );
    };

    // Process summaries to prioritize seating capacity and format values
    const processSummaries = () => {
        if (!data.summaries || !Array.isArray(data.summaries) || data.summaries.length === 0) return [];
        
        // Create a copy of the summaries array and filter out null/undefined items
        const summaries = [...data.summaries].filter(s => s && typeof s === 'object');
        
        // Find and prioritize seating capacity
        const seatingIndex = summaries.findIndex(s => 
            s?.name && (s.name.toLowerCase().includes('seat') || s.name === 'Seating Capacity')
        );
        
        if (seatingIndex > -1) {
            // Remove seating from current position and add to beginning
            const seatingSummary = summaries.splice(seatingIndex, 1)[0];
            summaries.unshift(seatingSummary);
        }
        
        // Format the display for each summary
        return summaries.map(summary => {
            // Check if the summary has a value property
            const valueKey = Object.keys(summary).find(key => 
                key !== 'name' && key !== 'icon_name' && key !== 'icon_import'
            );
            
            if (valueKey) {
                const value = summary[valueKey];
                
                // For seating capacity, always show the value
                if (summary.name && (summary.name.toLowerCase().includes('seat') || summary.name === 'Seating Capacity')) {
                    return {
                        ...summary,
                        displayText: value?.toString() || "",
                        showFeature: true
                    };
                }
                // For other features, only show if value is "Yes"
                else if (value === "Yes" || value === true) {
                    return {
                        ...summary,
                        displayText: "",
                        showFeature: true
                    };
                }
                // Don't show features with value not "Yes"
                else {
                    return {
                        ...summary,
                        showFeature: false
                    };
                }
            }
            
            // Default case if no value key found
            return {
                ...summary,
                displayText: "",
                showFeature: true
            };
        }).filter(summary => summary.showFeature); // Filter out features that shouldn't be shown
    };

    const processedSummaries = processSummaries();

   
        
    return (
        <div className="py-5 md:px-5">
            {/* Title & Address */}
            <h2 className="text-xl font-bold text-blue-950 lg:mt-2 mb-1">{data.property_name}</h2>
            
            {/* Vehicle Summary - Updated to match VehicleCard style */}
            <div className="flex flex-wrap gap-2 mb-4 mt-3">
                {processedSummaries.length > 0 ? (
                    processedSummaries.slice(0, 4).map((summary, i) => {
                        const IconComponent = getIcon(summary.icon_name);
                        return (
                            <span
                                key={i}
                                className="flex items-center text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                            >
                                <div className="mr-2">
                                    {IconComponent ? (
                                        <IconComponent className="text-yellow-800 text-sm" />
                                    ) : (
                                        <FaIcons.FaCertificate className="text-yellow-800 text-sm" />
                                    )}
                                </div>
                                <span className="font-medium">
                                    {summary.name || 'Feature'}
                                    {summary.displayText && `: ${summary.displayText}`}
                                </span>
                            </span>
                        );
                    })
                ) : (
                    <span className="text-sm text-gray-500">No features listed</span>
                )}
            </div>
           
           
             
            <div className="md:block hidden">
                <div className="flex justify-start md:justify-start">
                    <div className="flex items-center">
                        <span className="text-black md:text-[16px] text-[14px] font-bold">
                            For instant service:{" "}
                        </span>
                        <div className="mr-[5px] mt-[10px]">
                            <a
                                href={`tel:8801967776777`}
                                className="mx-[10px]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="phone-call md:w-[50px] md:h-[50px] w-[36px] h-[36px] ml-[15px]">
                                    <FaIcons.FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[8px] ml-[11px]" />
                                </div>
                            </a>
                        </div>
                        <div>
                            <Link
                                href={`https://wa.me/8801967776777`}
                                className="mx-[10px]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px]">
                                    <FaIcons.FaWhatsapp className="w-[25px] h-[25px] text-white" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
}