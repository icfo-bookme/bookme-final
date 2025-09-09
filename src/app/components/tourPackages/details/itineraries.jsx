import { useState } from 'react';
import Image from 'next/image';
import { GrDirections } from "react-icons/gr";

export default function Itineraries({ itineraries }) {
    const [activeTab, setActiveTab] = useState(0);

    if (!itineraries || Object.keys(itineraries).length === 0) {
        return (
            <div className="p-5 text-gray-500">No itineraries available</div>
        );
    }
    const days = Object.keys(itineraries);
    const currentActivities = itineraries[days[activeTab]];

    return (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className=" items-start gap-6 lg:gap-8 bg-white p-4 lg:p-6 rounded-t-lg">
                <div className="flex items-center gap-3 mb-4 lg:mb-0">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <GrDirections size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                        Itineraries
                    </h3>
                </div>

                {/* Tabs */}
                <div className="flex-1   overflow-x-auto">
                    <div className="flex border-b mt-2 rounded-lg bg-slate-200 border-gray-200 min-w-max">
                        {days.map((day, index) => (
                            <button
                                key={day}
                                className={`py-3  px-5 font-bold text-sm focus:outline-none whitespace-nowrap transition-colors ${activeTab === index
                                    ? 'border-b-2 border-blue-500 text-blue-700'
                                    : 'text-blue-950 hover:text-gray-700 hover:border-b-2 hover:border-gray-200'
                                    }`}
                                onClick={() => setActiveTab(index)}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activities for selected day */}
            <div className="divide-y divide-gray-100">
                {currentActivities.map((activity) => (
                    <div key={activity.id} className="bg-white p-4 md:p-6 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 sm:col-span-2 md:col-span-1">
                                <div className="font-medium text-gray-600 text-sm sm:text-base">
                                    {activity.time}
                                </div>
                            </div>
                            
                            <div className="col-span-12 sm:col-span-10">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {activity.image && (
                                        <div className="relative w-full md:w-64 h-48 md:h-40 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/bookme/public//${activity.image}`}
                                                alt={activity.name || 'Activity image'}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-800">{activity.name}</h3>
                                        <p className="text-gray-600 mt-1 text-sm md:text-base">{activity.value}</p>
                                        
                                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                            {activity.location && (
                                                <span className="flex items-center gap-1">
                                                    <i className="fa-solid fa-location-dot text-blue-500"></i>
                                                    {activity.location}
                                                </span>
                                            )}
                                            {activity.duration && (
                                                <span className="flex items-center gap-1">
                                                    <i className="fa-solid fa-clock text-blue-500"></i>
                                                    {activity.duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}