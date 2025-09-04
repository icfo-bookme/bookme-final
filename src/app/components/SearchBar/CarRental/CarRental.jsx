"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExchangeAlt } from "react-icons/fa";
import SearchButton from "@/utils/SearchButton";

const CarRentalSearchBar = ({ locationsData }) => {
    const router = useRouter();
    const locations = Array.isArray(locationsData) ? locationsData : [];

    const [searchParams, setSearchParams] = useState({
        pickupLocation: { id: 0, name: "", country: "" },
        dropoffLocation: { id: 0, name: "", country: "" },
        pickupDate: new Date().toISOString().split("T")[0],
        pickupTime: "10:00",
    });

    const [isMobile, setIsMobile] = useState(false);

    // ✅ Set default pickup/dropoff once locationsData is loaded
    useEffect(() => {
        if (
            locations.length >= 2 &&
            searchParams.pickupLocation.id === 0 &&
            searchParams.dropoffLocation.id === 0
        ) {
            setSearchParams((prev) => ({
                ...prev,
                pickupLocation: locations[0],
                dropoffLocation: locations[1],
            }));
        }
    }, [locations]);

    const swapLocations = () => {
        setSearchParams((prev) => ({
            ...prev,
            pickupLocation: prev.dropoffLocation,
            dropoffLocation: prev.pickupLocation,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const pickupId = searchParams.pickupLocation.id;

        const params = new URLSearchParams();
        params.set("dropoff", searchParams.dropoffLocation.id);
        params.set("date", searchParams.pickupDate);
        params.set("time", searchParams.pickupTime);

        router.push(`/Car/list/${pickupId}?${params.toString()}`);
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
            setSearchParams((prev) => ({
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
            const loc = searchParams[field];
            setQuery(loc.name && loc.country ? `${loc.name}, ${loc.country}` : "");
        }, [searchParams[field]]);

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

    return (
        <div className="bg-white max-w-6xl mx-auto pb-6 text-blue-950 rounded-lg relative">
            <form onSubmit={handleSearch} className="w-full">
                <div className="flex flex-col md:flex-row items-end gap-3 md:gap-4">
                    <div className="w-full md:flex-1">
                        <SearchableLocationField label="PICKUP LOCATION" field="pickupLocation" />
                    </div>

                    {!isMobile && (
                        <div className="h-12 flex items-center justify-center md:px-0">
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

                    <div className="w-full md:flex-1">
                        <SearchableLocationField label="DROPOFF LOCATION" field="dropoffLocation" />
                    </div>

                    {isMobile && (
                        <div className="w-full flex justify-center py-2">
                            <button
                                type="button"
                                onClick={swapLocations}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                aria-label="Swap pickup and dropoff locations"
                            >
                                <FaExchangeAlt className="h-4 w-4" />
                                <span className="text-sm">Swap Locations</span>
                            </button>
                        </div>
                    )}

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 md:flex md:flex-1">
                        <div className="w-full">
                            <DateTimeSearchField
                                label="PICKUP DATE"
                                type="date"
                                value={searchParams.pickupDate}
                                onChange={(e) =>
                                    setSearchParams((prev) => ({
                                        ...prev,
                                        pickupDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="w-full">
                            <DateTimeSearchField
                                label="PICKUP TIME"
                                type="time"
                                value={searchParams.pickupTime}
                                onChange={(e) =>
                                    setSearchParams((prev) => ({
                                        ...prev,
                                        pickupTime: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
                    <SearchButton type="submit">Search Activities</SearchButton>
                </div>
            </form>
        </div>
    );
};

export default CarRentalSearchBar;
