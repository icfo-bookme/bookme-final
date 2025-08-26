"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuMapPin } from "react-icons/lu";
import SearchButton from "@/utils/SearchButton";

const ListingSearchBar = ({
    label = "TOUR DESTINATIONS", 
    query = "/tour/packages/",  
    data = []
}) => {
    const router = useRouter();
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize destinations and handle URL params
    useEffect(() => {
        if (data?.length > 0) {
            setFilteredDestinations(data);

            const paramId = params?.id;
            if (paramId) {
                const destinationFromParam = data.find(
                    (dest) => dest.id.toString() === paramId.toString()
                );

                if (destinationFromParam) {
                    setSearchQuery(`${destinationFromParam.name}, ${destinationFromParam.country}`);
                    setSelectedDestination(destinationFromParam);
                    return;
                }
            }

            setSearchQuery("");
            setSelectedDestination(null);
        }
    }, [data, params]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredDestinations(data);
            setSelectedDestination(null);
            return;
        }

        const filtered = data.filter((dest) => {
            const destString = `${dest.name}, ${dest.country}`.toLowerCase();
            return destString.includes(query.toLowerCase());
        });

        setFilteredDestinations(filtered);
    };

    const handleSearchFocus = () => {
        setShowSuggestions(true);
        if (searchQuery === "") {
            setFilteredDestinations(data);
        }
    };


    const selectDestination = (destination) => {
        setSearchQuery(`${destination.name}, ${destination.country}`);
        setSelectedDestination(destination);
        setShowSuggestions(false);

    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedDestination) {
            const firstMatch = filteredDestinations[0];
            if (firstMatch) {
                setSelectedDestination(firstMatch);
                router.push(`/tour/packages/${firstMatch.id}`);
                return;
            }
            alert("Please select a destination from the list");
            return;
        }
        router.push(`${query}/${selectedDestination.id}`);
    };

    return (
        <div className="bg-white mx-auto md:pb-4 pb-3  rounded-xl">
            <form onSubmit={handleSearch}>
                <div className="flex flex-nowrap gap-3 items-end w-full">
                    {/* Search Input */}
                    <div className="flex-1 relative min-w-[160px]" ref={searchRef}>
                        <label
                            htmlFor="destination-search"
                            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                        >
                            {label}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LuMapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <input
                                type="text"
                                ref={inputRef}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                placeholder="Search tour destinations..."
                                className=" p-3 h-10 sm:h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-sm sm:text-lg pl-10"
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredDestinations.length > 0 && (
                            <ul
                                id="destination-suggestions"
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto"
                                role="listbox"
                            >
                                {filteredDestinations.map((destination) => (
                                    <li
                                        key={destination.id}
                                        role="option"
                                        aria-selected={selectedDestination?.id === destination.id}
                                        className={`p-3  hover:bg-blue-50 cursor-pointer transition-colors ${selectedDestination?.id === destination.id ? 'bg-blue-100' : ''
                                            }`}
                                        onClick={() => selectDestination(destination)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') selectDestination(destination);
                                        }}
                                        tabIndex={0}
                                    >
                                        <div className="font-medium">{destination.name}</div>
                                        <div className="text-sm text-gray-500">{destination.country}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Search Button */}
                    <div className="flex-shrink-0">
                        <SearchButton
                            type="submit"
                            className="md:h-10 h-8  w-full sm:w-auto whitespace-nowrap min-w-[90px] "
                        >
                            Modify
                        </SearchButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ListingSearchBar;
