"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import propertySummary from "@/services/tour/propertySummary";
import IconShow from "@/services/tour/IconShow";
import { TailSpin } from "react-loader-spinner";
import { Roboto } from "next/font/google";
import { RangeSlider } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useSearch } from "@/SearchContext";
import getContactNumber from "@/services/tour/getContactNumber";
import { FaFilter, FaPhone, FaSortAmountDown, FaWhatsapp } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import { usePagination } from "@/services/tour/usePagination";
import { IoSearch, IoClose } from "react-icons/io5";
import TanguarHaorHouseboat from "../../pre-footer-content/Tangua";


const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function Property({ id }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { currentPage, handlePageChange, setCurrentPage } = usePagination();
  const [data, setData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [price, setPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("1");
  const [contactNumber, setContactNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const searchInputRef = useRef(null);
  const propertyListRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [propertyNames, setPropertyNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const itemsPerPage = 10;

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const previousScrollPosition = window.scrollY;
    setSearchTerm(data.property);
    setCurrentPage(1);
    setShowSuggestions(false);
    setTimeout(() => {
      window.scrollTo(0, previousScrollPosition);
    }, 0);
  };

  const handleClearSearch = () => {
    const previousScrollPosition = window.scrollY;
    setSearchTerm("");
    setCurrentPage(1);
    setShowSuggestions(false);
    setTimeout(() => {
      window.scrollTo(0, previousScrollPosition);
    }, 0);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Fetch property data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const locationId = id;
        const result = await propertySummary(locationId);
        setData(result);
        
        // Extract property names for suggestions
        const names = result.map(property => property.property_name);
        setPropertyNames(names);
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }
    fetchData();
  }, [id]);

  // Update filtered suggestions when search term changes
  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      const filtered = propertyNames.filter(name => 
        normalizeString(name).includes(normalizedSearchTerm)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, propertyNames]);

  // Fetch popular property data
  useEffect(() => {
    async function fetchPopularData() {
      if (sortOption === "4") {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/popularPropertySummary/1`
          );
          const result = await response.json();
          setPopularData(result);
        } catch (error) {
          console.error("Error fetching popular property data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchPopularData();
  }, [sortOption]);

  // Fetch contact number
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getContactNumber();
        setContactNumber(result);
      } catch (error) {
        console.error("Error fetching contact number data:", error);
      }
    }
    fetchData();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (sortOption === "4") {
      return popularData;
    }

    const getMinPrice = (property) => {
      const prices = property.property_uinit?.flatMap((unit) =>
        unit.price?.map((priceObj) => priceObj.price)
      ) || [];
      return prices.length > 0 ? Math.min(...prices) : Infinity;
    };

    const sorted = [...data].sort((a, b) => {
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);

      if (priceA === Infinity && priceB === Infinity) return 0;
      if (priceA === Infinity) return 1;
      if (priceB === Infinity) return -1;

      return sortOption === "2" ? priceA - priceB : priceB - priceA;
    });

    return sorted;
  }, [data, sortOption, popularData]);

  // Normalize string for search (handles Bangla and English)
  const normalizeString = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  };

  // Filter data with improved search
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      filtered = filtered.filter((property) => {
        const normalizedPropertyName = normalizeString(property.property_name);
        return normalizedPropertyName.includes(normalizedSearchTerm);
      });
    }

    if (price <= 9500) {
      filtered = filtered.filter((property) => {
        const prices = property.property_uinit?.flatMap(
          (unit) => unit.price?.map((priceObj) => priceObj.price) || []
        );
        return prices.length > 0 && Math.min(...prices) <= price;
      });
    }

    return filtered;
  }, [sortedData, searchTerm, price]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Save scroll position, card index, and current page
  const handleCardClick = (index) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    sessionStorage.setItem("lastViewedCardIndex", index);
    sessionStorage.setItem("currentPage", currentPage);
  };

  // Restore scroll position, card index, and current page
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    const lastViewedCardIndex = sessionStorage.getItem("lastViewedCardIndex");
    const savedCurrentPage = sessionStorage.getItem("currentPage");

    if (savedCurrentPage) {
      setCurrentPage(parseInt(savedCurrentPage, 10));
    }

    if (scrollPosition && lastViewedCardIndex) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition));
        const cardElement = document.querySelector(
          `[data-index="${lastViewedCardIndex}"]`
        );
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        sessionStorage.removeItem("scrollPosition");
        sessionStorage.removeItem("lastViewedCardIndex");
        sessionStorage.removeItem("currentPage");
      }, 1000);
    } else {
      window.scrollTo(0, 0);
    }
  }, [sortedData]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = suggestion;
    }
    setShowSuggestions(false);
  };

  return (
    <div
      className={`${roboto.className} bg-white lg:container lg:w-full mx-auto lg:px-4 z-20`}
      ref={propertyListRef}
    >
      
      <div className={`mb-8 bg-white ${isSearchFocused ? 'absolute inset-0 h-72  pt-20 px-4 pb-4 z-20' : ''}`}>
        <div className={`flex flex-col md:flex-row bg-white gap-6 mb-6`}>
          {/* Search Form */}
          <div className={`flex-1 lg:hidden relative`}>
            <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("property")}
                ref={searchInputRef}
                type="text"
                defaultValue={searchTerm}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition duration-200"
                onChange={(e) => {
                  const previousScrollPosition = window.scrollY;
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  setTimeout(() => {
                    window.scrollTo(0, previousScrollPosition);
                  }, 0);
                }}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchTerm && filteredSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Use setTimeout to allow click events on suggestions to fire first
                  setTimeout(() => {
                    setIsSearchFocused(false);
                    setShowSuggestions(false);
                  }, 200);
                }}
                placeholder="Search properties by name..."
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <IoClose className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </form>

            {/* Custom Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-30  w-full mt-1 text-black bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
                
              </div>
            )}
          </div>
        </div>

        {/* Filter and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Price Filter */}
          <div className="w-full lg:w-2/3 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-700">
                <FaFilter className="h-5 w-5" />
                <span className="text-sm font-medium">Price Range</span>
              </div>
              <div className="flex-1 flex items-center gap-4 ">
                <RangeSlider
                  id="default-range"
                  min={0}
                  max={10000}
                  step={500}
                  value={price}
                  onChange={(e) => {
                    const previousScrollPosition = window.scrollY;
                    setPrice(Number(e.target.value));
                    setTimeout(() => {
                      window.scrollTo(0, previousScrollPosition);
                    }, 0);
                  }}
                  tooltip="true"
                  tooltipposition="top" 
                  className="w-full  mt-[-18px] appearance-none h-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-blue-700 whitespace-nowrap min-w-[90px]">
                  {parseInt(price).toLocaleString()}
                  {parseInt(price) > 9500 ? "+" : ""} TK
                </span>
              </div>
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="w-full lg:w-1/3 flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-gray-700">
              <FaSortAmountDown className="h-4 w-4" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <select
              className="w-full border border-gray-300 rounded-lg text-gray-700 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white shadow-sm"
              value={sortOption}
              onChange={(e) => {
                const previousScrollPosition = window.scrollY;
                setSortOption(e.target.value);
                setCurrentPage(1);
                setTimeout(() => {
                  window.scrollTo(0, previousScrollPosition);
                }, 0);
              }}
            >
              <option value="1" disabled hidden>Select option</option>
              <option value="2">Price: Low to High</option>
              <option value="3">Price: High to Low</option>
              <option value="4">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <TailSpin height="80" width="80" color="#0678B4" />
        </div>
      ) : (
        <>
          {/* No results found */}
          {initialLoadComplete && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-2xl font-bold text-gray-700 mb-4">
                No properties found
              </div>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : "No properties match your current filters"}
              </p>
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Property List */}
          {paginatedData.length > 0 &&
            paginatedData.map((property, index) => (
              <div key={property.property_id} data-index={index} className="mb-5">
                {/* Property Card */}
                <div className="shadow-custom flex flex-col lg:flex-row gap-5 pt-5 pl-5 pr-5 pb-0 rounded bg-white relative">
                  {/* Discount Badge - positioned absolutely within the card */}
                  {property.discout && (
                    <div className="absolute top-5 right-5 lg:top-5 lg:left-[315px] z-10 w-14 h-14 p-2 text-white text-center font-semibold text-sm bg-red-700 rounded-full flex items-center justify-center">
                      {property.discout}
                    </div>
                  )}
                  
                  <div className="md:min-w-[400px] min-w-0 md:min-h-[300px] min-h-0 relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${property.main_img}`}
                      alt={property.property_name}
                      width={500}
                      height={300}
                      className="object-cover w-full md:w-[300px] md:h-[230px] h-[200px] mx-auto"
                    />
                  </div>

                  <div className="flex flex-col w-full pr-4 pb-4">
                    <Link
                      href={`/Property/${property.property_id}`}
                      className="cursor-pointer"
                      onClick={() => handleCardClick(index)}
                    >
                      <h1 className="font-heading font-semibold text-lg text-[#00026E]">
                        {property.property_name}
                      </h1>
                    </Link>

                    <h1 className="font-normal text-sm text-[#00026E] text-right md:mb-0 mb-[20px]">
                      Starting from <br />
                      <span className="font-bold text-lg text-blue-900">
                        {(() => {
                          const prices =
                            property.property_uinit?.flatMap((unit) =>
                              unit.price?.map((priceObj) => priceObj.price)
                            ) || [];
                          return prices.length > 0
                            ? `${Math.min(...prices).toLocaleString()} TK`
                            : "N/A";
                        })()}
                      </span>
                    </h1>

                    {property.property_summaries && (
                      <div className="flex flex-col gap-3">
                        {/* Property Summaries */}
                        <div className="flex flex-wrap gap-4">
                          {property.property_summaries
                            .slice(0, 1)
                            .map((summary) => (
                              <div
                                key={summary.id}
                                className="flex items-center text-blue-700"
                              >
                                <IconShow iconName={summary.icons.icon_name} />
                                <span className="ml-2 text-sm text-blue-900">
                                  {summary.value}
                                </span>
                              </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex gap-4 w-full md:w-auto">
                            {property.property_summaries
                              .slice(1, 3)
                              .map((summary) => (
                                <div
                                  key={summary.id}
                                  className="flex items-center text-gray-700"
                                >
                                  <IconShow iconName={summary.icons.icon_name} />
                                  <span className="ml-2 text-sm text-gray-900">
                                    {summary.value}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          {property.property_summaries
                            .slice(3, 4)
                            .map((summary) => (
                              <div
                                key={summary.id}
                                className="flex items-center text-gray-700"
                              >
                                <div>
                                  <IconShow iconName={summary.icons.icon_name} />
                                </div>
                                <span className="ml-2 text-sm text-blue-900">
                                  {summary.value}
                                </span>
                              </div>
                            ))}
                        </div>
                        <div className="flex flex-row flex-wrap md:justify-between justify-start items-center gap-[5px] sm:gap-[25px]">
                          {/* Buttons */}
                          <div className="flex">
                            <div className="mr-[6px]">
                              <Link
                                href={`/Property/${property.property_id}`}
                                style={{
                                  background:
                                    "linear-gradient(90deg, #313881, #0678B4)",
                                }}
                                className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 px-[5px] py-2 text-white font-semibold rounded-md"
                                onClick={() => handleCardClick(index)}
                              >
                                See Details
                              </Link>
                            </div>

                            <div>
                              <Link
                                href={`/Property/${property.property_id}`}
                                style={{
                                  background:
                                    "linear-gradient(90deg, #313881, #0678B4)",
                                }}
                                className="text-[11px] md:text-[14px] xl:text-[16px] h-[40px] sm:px-4 py-2 px-[5px] text-white font-semibold rounded-md"
                                onClick={() => handleCardClick(index)}
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                          <div className="md:hidden block mt-[10px]">
                            <a
                              href={`tel:${contactNumber?.Phone}`}
                              className="mr-[-1px] ml-0"
                            >
                              <div className="phone-call md:w-[50px] md:h-[50px] w-[37px] h-[37px] ml-[15px]">
                                <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[10px] ml-[10px]" />
                              </div>
                            </a>
                          </div>
                          <div className="md:hidden block mt-[10px]">
                            <Link
                              href={`https://wa.me/${contactNumber?.Phone}`}
                              className="mx-[10px]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px] ml-[15px]">
                                <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                              </span>
                            </Link>
                          </div>
                          <div className="md:block hidden">
                            <div className="flex justify-start md:justify-start">
                              <div className="flex items-center">
                                <span className="text-black md:text-[16px] text-[14px] font-bold">
                                  For instant service:{" "}
                                </span>
                                <div className="mr-[5px] mt-[10px]">
                                  <a
                                    href={`tel:${contactNumber?.Phone}`}
                                    className="mx-[10px]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <div className="phone-call md:w-[50px] md:h-[50px] w-[36px] h-[36px] ml-[15px]">
                                      <FaPhone className="i md:ml-[17px] md:mt-[17px] mt-[8px] ml-[11px]" />
                                    </div>
                                  </a>
                                </div>
                                <div>
                                  <Link
                                    href={`https://wa.me/${contactNumber?.Phone}`}
                                    className="mx-[10px]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border md:w-[50px] md:h-[50px] w-[36px] h-[36px] md:mt-[0px] mt-[-5px]">
                                      <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
      <TanguarHaorHouseboat/>
    </div>
  );
}