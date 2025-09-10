"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaExchangeAlt,
    FaEdit,
    FaTimes
} from "react-icons/fa";
import SearchButton from "@/utils/SearchButton";

const CarRentalSearchBar = ({ locationsData, initialParams }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const locations = Array.isArray(locationsData) ? locationsData : [];

    const [searchParamsState, setSearchParamsState] = useState({
        pickupLocation: { id: 0, name: "", country: "" },
        dropoffLocation: { id: 0, name: "", country: "" },
        pickupDate: new Date().toISOString().split("T")[0],
        pickupTime: "10:00",
    });

    const [isMobile, setIsMobile] = useState(false);
    const [showMobileModal, setShowMobileModal] = useState(false);

    // Detect mobile screen
    useEffect(() => {
        const updateScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);
        return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    // Set initial values from URL params
    useEffect(() => {
        if (locations.length > 0 && initialParams) {
            const pickupId = parseInt(initialParams.pickupId);
            const dropoffId = parseInt(initialParams.dropoffId);

            const pickupLocation = locations.find(loc => loc.id === pickupId) || locations[0];
            const dropoffLocation = locations.find(loc => loc.id === dropoffId) || locations[1];

            setSearchParamsState({
                pickupLocation,
                dropoffLocation,
                pickupDate: initialParams.pickupDate || new Date().toISOString().split("T")[0],
                pickupTime: initialParams.pickupTime || "10:00",
            });
        }
    }, [locations, initialParams]);

    const swapLocations = () => {
        setSearchParamsState((prev) => ({
            ...prev,
            pickupLocation: prev.dropoffLocation,
            dropoffLocation: prev.pickupLocation,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const pickupId = searchParamsState.pickupLocation.id;
        const params = new URLSearchParams();
        params.set("dropoff", searchParamsState.dropoffLocation.id);
        params.set("date", searchParamsState.pickupDate);
        params.set("time", searchParamsState.pickupTime);

        router.push(`/Car/list/${pickupId}?${params.toString()}`);
        setShowMobileModal(false); // Close modal if open
    };

    const SearchableLocationField = ({ label, field }) => {
        const inputRef = useRef();
        const [query, setQuery] = useState("");
        const [showDropdown, setShowDropdown] = useState(false);
        const [firstFocusDone, setFirstFocusDone] = useState(false);

        const filteredLocations = locations.filter((loc) =>
            `${loc.name}, ${loc.country}`.toLowerCase().includes(query.toLowerCase())
        );

        const handleSelect = (location) => {
            setSearchParamsState((prev) => ({
                ...prev,
                [field]: location,
            }));
            setQuery(`${location.name}, ${location.country}`);
            setShowDropdown(false);
        };

        const handleFocus = () => {
            setShowDropdown(true);
            if (!firstFocusDone) {
                setQuery("");
                setFirstFocusDone(true);
            }
        };

        useEffect(() => {
            const loc = searchParamsState[field];
            setQuery(loc.name && loc.country ? `${loc.name}, ${loc.country}` : "");
        }, [searchParamsState[field]]);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (inputRef.current && !inputRef.current.contains(e.target)) {
                    setShowDropdown(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div className="flex-1 w-full min-w-0 relative" ref={inputRef}>
                <label className="block text-sm text-blue-950 font-medium mb-1">{label}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={handleFocus}
                        className="p-3 h-12 border border-gray-300 rounded-lg w-full text-blue-950 text-base font-bold pl-10 bg-white"
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                </div>

                {showDropdown && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
                        {filteredLocations.length > 0 ? (
                            filteredLocations.map((loc) => (
                                <li
                                    key={loc.id}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleSelect(loc)}
                                >
                                    {loc.name}, {loc.country}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-red-500 font-medium">No destinations found</li>
                        )}
                    </ul>
                )}
            </div>
        );
    };

    const DateTimeSearchField = ({ label, type, value, onChange }) => (
        <div className="flex-1 w-full min-w-0">
            <label className="block text-sm text-blue-950 font-medium mb-1">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {type === "date" ? (
                        <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                    ) : (
                        <FaClock className="h-4 w-4 text-blue-600" />
                    )}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="p-3 h-12 border border-gray-300 rounded-lg w-full text-blue-950 text-base font-bold pl-10 bg-white"
                />
            </div>
        </div>
    );

    const FormFields = () => (
        <>
            <div className="w-full md:w-1/4">
                <SearchableLocationField label="PICKUP LOCATION" field="pickupLocation" />
            </div>

            {!isMobile && (
                <div className="h-12 flex items-center justify-center px-2 md:mt-6">
                    <button
                        type="button"
                        onClick={swapLocations}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Swap pickup and dropoff locations"
                    >
                        <FaExchangeAlt className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div className="w-full md:w-1/4">
                <SearchableLocationField label="DROPOFF LOCATION" field="dropoffLocation" />
            </div>

            <div className="w-full md:w-2/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimeSearchField
                    label="PICKUP DATE"
                    type="date"
                    value={searchParamsState.pickupDate}
                    onChange={(e) =>
                        setSearchParamsState((prev) => ({
                            ...prev,
                            pickupDate: e.target.value,
                        }))
                    }
                />
                <DateTimeSearchField
                    label="PICKUP TIME"
                    type="time"
                    value={searchParamsState.pickupTime}
                    onChange={(e) =>
                        setSearchParamsState((prev) => ({
                            ...prev,
                            pickupTime: e.target.value,
                        }))
                    }
                />
            </div>
        </>
    );

    return (
        <>
            <div className="bg-white p-4 md:p-6 rounded-lg mb-6">
                <form onSubmit={handleSearch} className="w-full">
                    {isMobile ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <SearchableLocationField label="PICKUP LOCATION" field="pickupLocation" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowMobileModal(true)}
                                className="text-blue-600 bg-slate-200 p-3 mt-4 rounded-lg hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
                            >
                                <FaEdit /> Edit
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-end gap-4">
                            {FormFields()}
                            <div className="w-full md:w-1/6 mt-2 md:mt-0">
                                <SearchButton type="submit" className="w-full h-12 ">
                                    Modify 
                                </SearchButton>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Mobile Modal */}
            {isMobile && showMobileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
                        <button
                            onClick={() => setShowMobileModal(false)}
                            className="absolute top-3 right-3 text-blue-800 hover:text-red-500"
                        >
                            <FaTimes />
                        </button>
                        <form onSubmit={handleSearch} className="space-y-4">
                            {FormFields()}
                            <div>
                                <SearchButton type="submit" className="w-full h-12">
                                    Modify Search
                                </SearchButton>
                            </div>
                            <div className="flex justify-center mt-2">
                                <button
                                    type="button"
                                    onClick={swapLocations}
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                                >
                                    <FaExchangeAlt /> Swap Locations
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CarRentalSearchBar;
