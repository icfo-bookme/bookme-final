'use client';
import { useState, useEffect, useRef } from 'react';
import * as IoIcons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import * as GoIcons from "react-icons/go";
import { FaLocationDot } from 'react-icons/fa6';
import Link from 'next/link';

export default function PropertySummary({ data }) {
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
            null
        );
    };
    // Process requirements HTML to ensure proper formatting
    const processedRequirements = data.requirements
        ? data.requirements
            .replace(/&nbsp;/g, ' ')
            .replace(/<ul>/g, '<ul class="list-disc pl-8">')
        : '';
    return (
        <div className="py-5 md:px-5">
            {/* Title & Address */}
            <h2 className="text-xl font-bold text-blue-950 lg:mt-2 mb-1">{data.property_name}</h2>
            <div className='flex items-center text-gray-700 gap-1 text-sm'>
                <FaLocationDot />
                {data.address}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {data.summaries?.slice(1, 4).map((summary, index) => {
                    const IconComponent = getIcon(summary.icon_name);
                    return (
                        <div
                            key={index}
                            className={`flex items-start text-gray-800 gap-2 text-sm ${index === 2 ? "col-span-2" : "col-span-1"
                                }`}
                        >
                            {IconComponent && (
                                <IconComponent
                                    className="text-blue-500"
                                    style={{ fontSize: "1.25rem", flexShrink: 0 }}
                                />
                            )}
                            <span className="flex-1 leading-snug">{summary.value}</span>
                        </div>
                    );
                })}
            </div>
           
            {/* Requirements clickable text */}
            {data.requirements && (
                <div className="mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-500  hover:text-blue-700"
                    >
                        <i className="fa-solid fa-eye text-blue-700"></i> View Requirements
                    </button>

                </div>
            )}
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
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                        >
                            ✖
                        </button>
                        <h3 className="text-lg text-blue-950 font-semibold mb-4">Requirements</h3>
                        <div
                            className="prose prose-sm text-gray-700 max-w-none"
                            dangerouslySetInnerHTML={{ __html: processedRequirements }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}