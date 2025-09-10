"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMapMarkerAlt, FaSearch, FaRegClock } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PiUsersThree } from "react-icons/pi";
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { GiDiamondHard } from "react-icons/gi";

// Helper: Calculate discounted price
function calculateDiscountedPrice(originalPrice, discount) {
    return Math.round(originalPrice * (1 - discount / 100));
}

// Helper: Find similar package names
function findSimilarPackages(searchTerm, packages = []) {
    if (!searchTerm) return packages;

    const lowerSearchTerm = searchTerm.toLowerCase();

    const exactMatches = packages.filter(pkg =>
        pkg?.property_name?.toLowerCase().includes(lowerSearchTerm)
    );

    if (exactMatches.length > 0) return exactMatches;

    return packages.filter(pkg => {
        const packageName = pkg?.property_name?.toLowerCase() || "";
        return (
            packageName.includes(lowerSearchTerm) ||
            lowerSearchTerm.includes(packageName) ||
            packageName.split(" ").some(word => word.startsWith(lowerSearchTerm)) ||
            lowerSearchTerm.split(" ").some(word => packageName.startsWith(word))
        );
    });
}

const ActivitiesCard = ({ packageData = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const filteredPackages = useMemo(() => {
        if (!searchTerm) return packageData;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return packageData.filter(pkg =>
            pkg?.property_name?.toLowerCase().includes(lowerSearchTerm)
        );
    }, [packageData, searchTerm]);

    const similarPackages = useMemo(
        () => findSimilarPackages(searchTerm, packageData),
        [searchTerm, packageData]
    );

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
    };

    const handleSearchFocus = () => setShowSuggestions(true);

    const selectSuggestion = packageName => {
        setSearchTerm(packageName);
        setShowSuggestions(false);
    };

    const slugify = (str) =>
        str
            ?.toLowerCase()
            ?.trim()
            ?.replace(/\s+/g, '-')
            ?.replace(/[^\w\u0980-\u09FF\-]+/g, '')
            ?.replace(/\-\-+/g, '-') || '';

    const renderSummaryIcon = (iconName) => {
        switch (iconName) {
            case 'IoLocationOutline':
                return <IoLocationOutline className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'FaRegClock':
                return <FaRegClock className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'PiUsersThree':
                return <PiUsersThree className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'GoCommentDiscussion':
                return <GoCommentDiscussion className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'MdOutlineFreeCancellation':
                return <MdOutlineFreeCancellation className="mr-1 mt-0.5 flex-shrink-0" />;
            case 'GiDiamondHard':
                return <GiDiamondHard className="mr-1 mt-0.5 flex-shrink-0" />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4">
            {/* Sticky Search Bar Container */}
            <div className="top-16 z-20 bg-white lg:w-[50%] rounded-xl lg:mx-auto py-3 -mx-4 px-4 shadow-sm border-b border-gray-200">
                <div className="relative max-w-2xl mx-auto">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search tour packages..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="w-full py-3 h-12 px-4 pr-12 rounded-lg border text-gray-800 border-gray-300 outline-none ring-2 ring-blue-500 border-transparent shadow-sm"
                        />
                        <FaSearch className="absolute right-4 text-gray-400" />
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && similarPackages.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                            {similarPackages.map(pkg => (
                                <div
                                    key={pkg.id}
                                    className="px-4 py-2 hover:bg-blue-50 text-gray-950 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => selectSuggestion(pkg.property_name)}
                                >
                                    <p className="font-medium">{pkg.property_name || "No Name"}</p>
                                    <p className="text-sm text-gray-500 truncate flex gap-1">
                                        <IoLocationOutline className="text-gray-800 mt-[2px]" />
                                        {pkg.address || "No address"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-4 pb-6">
                {filteredPackages?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredPackages?.map(pkg => {
                            const price = Number(pkg?.price) || 0;
                            const discountPercent = Number(pkg?.discount_percent) || 0;
                            const discountAmount = Number(pkg?.discount_amount) || 0;
                            const finalPrice = pkg?.final_price || 
                                (discountPercent > 0 
                                    ? calculateDiscountedPrice(price, discountPercent)
                                    : price - discountAmount);
                            
                            const imageUrl = pkg?.image
                                ? `${baseUrl}/storage/${pkg.image}`
                                : "/default-tour.jpg";

                            return (
                                <div
                                    key={pkg.id}
                                    className="bg-gray-100 w-[96%] mx-auto rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 relative"
                                >
                                    {/* Discount Badge */}
                                    {(discountPercent > 0 || discountAmount > 0) && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                                            {discountPercent > 0 
                                                ? `${discountPercent}% OFF` 
                                                : `${discountAmount} BDT OFF`}
                                        </div>
                                    )}
                                    
                                    <div className="relative h-40 sm:h-48 w-full">
                                        <Image
                                            src={imageUrl}
                                            alt={pkg.property_name || "Tour Package"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>

                                    <div className="p-3 sm:p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link
                                                href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                            >
                                                <h3 className="text-base sm:text-lg font-bold text-blue-950 hover:text-blue-700 transition-colors">
                                                    {pkg.property_name || "No Name"}
                                                </h3>
                                            </Link>
                                        </div>

                                        <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-3">
                                            <FaMapMarkerAlt className="mr-1 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">
                                                {pkg.address || "Unknown location"}
                                            </span>
                                        </div>

                                        {/* Package Summaries */}
                                        {pkg.summaries && pkg.summaries.length > 0 && (
                                            <>
                                                <div className="grid grid-cols-4 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                                                    {pkg.summaries.slice(0, 2).map((summary, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start col-span-2"
                                                        >
                                                            {renderSummaryIcon(summary.icon_name)}
                                                            <span className="ml-1">{summary.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                 <div className="grid grid-cols-4 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                                                    {pkg.summaries.slice(2, 3).map((summary, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start col-span-4"
                                                        >
                                                            {renderSummaryIcon(summary.icon_name)}
                                                            <span className="ml-1">{summary.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                               
                                            </>
                                        )}

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div>
                                                <p className="text-2xs xs:text-xs text-gray-500">
                                                    Starting From
                                                </p>
                                                <div className="flex items-center">
                                                    {discountPercent > 0 || discountAmount > 0 ? (
                                                        <>
                                                            <p className="text-base sm:text-lg font-bold text-blue-600">
                                                                {finalPrice.toLocaleString()} BDT
                                                            </p>
                                                            {price > 0 && (
                                                                <p className="text-xs text-gray-500 line-through ml-2">
                                                                    {price.toLocaleString()} BDT
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-base sm:text-lg font-bold text-blue-600">
                                                            {price > 0 ? `${price.toLocaleString()} BDT` : "Price on request"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/${slugify(pkg.property_name)}/${pkg.id}`}
                                                style={{
                                                    background: "linear-gradient(90deg, #313881, #0678B4)",
                                                }}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 hover:opacity-90 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-700">No tour packages found</h3>
                        <p className="text-gray-500 mt-2">
                            {searchTerm
                                ? `No packages match "${searchTerm}". Try a different search term.`
                                : "No tour packages available at the moment."}
                        </p>

                        {searchTerm && similarPackages.length > 0 && (
                            <div className="mt-6 max-w-md mx-auto">
                                <h4 className="font-medium text-gray-700 mb-2">Did you mean:</h4>
                                <div className="grid gap-2">
                                    {similarPackages.map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => selectSuggestion(pkg.property_name)}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                                        >
                                            {pkg.property_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivitiesCard;