"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LuMapPin } from "react-icons/lu";
import SearchButton from "@/utils/SearchButton";
import { FaHiking } from "react-icons/fa";


const ActivitiesSearchBar = ({ data }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        if (data?.length > 0) {
            setFilteredDestinations(data);
            // Set initial search query with first destination
            setSearchQuery(`${data[0].name}, ${data[0].country}`);
            setSelectedDestination(data[0]);
        }
    }, [data]);

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

        const filtered = data.filter(dest => {
            const destString = `${dest.name}, ${dest.country}`.toLowerCase();
            return destString.includes(query.toLowerCase());
        });

        setFilteredDestinations(filtered);
    };

    const handleSearchFocus = () => {
        setShowSuggestions(true);
        setFilteredDestinations(data);
    };

    const selectDestination = (destination) => {
        setSearchQuery(`${destination.name}, ${destination.country}`);
        setSelectedDestination(destination);
        setShowSuggestions(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedDestination) {
            alert("Please select a destination from the list");
            return;
        }
        router.push(`/activities/list/${selectedDestination.id}`);
    };

    return (
        <div className="bg-white max-w-5xl mx-auto pb-6 text-blue-950 relative ">
            <form onSubmit={handleSearch}>
                <div className="gird grid-cols-2">
                    <div className="grid grid-cols-1 gap-4 relative" ref={searchRef}>
                        <div className="space-y-1 relative">
                            <label className="block text-sm text-blue-950 font-medium">
                                ACTIVITIES/DESTINATION</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    < FaHiking className="h-5 w-5 text-blue-600" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    placeholder="Search tour destinations..."
                                    className="p-3 h-12 border border-gray-300 rounded-lg hover:border-blue-900 focus:border-blue-900 focus:ring-0 transition-colors w-full font-bold text-blue-950 text-lg pl-10"
                                />
                            </div>
                            {showSuggestions && filteredDestinations.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredDestinations.map((destination) => (
                                        <div
                                            key={destination.id}
                                            className="p-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                                            onClick={() => selectDestination(destination)}
                                        >
                                            {destination.name}, {destination.country}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2 flex justify-end">
                        <SearchButton
                            type="submit">Search Tours</SearchButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ActivitiesSearchBar;