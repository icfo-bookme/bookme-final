"use client"
import { useState } from "react";
import { Card } from "./Card";

export const Tab = ({ flightRoutes , homepage }) => {
    const [activeTab, setActiveTab] = useState('domestic');

    return (
        <div>
            <div className="flex space-x-4 mb-6 justify-center items-center">
                <button
                    className={`py-3 px-6 rounded-lg transition-colors duration-200 text-md font-bold ${activeTab === 'domestic'
                        ? 'text-white shadow-md'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    style={
                        activeTab === 'domestic'
                            ? { background: "linear-gradient(90deg, #313881, #0678B4)" }
                            : {}
                    }
                    onClick={() => setActiveTab('domestic')}
                >
                    Domestic
                </button>

                <button
                    className={`py-3 px-6 rounded-lg transition-colors duration-200 text-md font-bold ${activeTab === 'international'
                        ? 'text-white shadow-md'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    style={
                        activeTab === 'international'
                            ? { background: "linear-gradient(90deg, #313881, #0678B4)" }
                            : {}
                    }
                    onClick={() => setActiveTab('international')}
                >
                    International
                </button>
            </div>


            {activeTab === 'domestic' ? (
                <Card homepage={homepage} flightRoutes={flightRoutes.domestic} />
            ) : (
                <Card homepage={homepage} flightRoutes={flightRoutes.international} />
            )}
        </div>
    );
};