"use client";

import { useState, useEffect, useMemo } from "react";
import propertySummary from "@/services/tour/propertySummary";
import { useSearch } from "@/SearchContext";
import { usePagination } from "@/services/tour/usePagination";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";

import PropertyNoResults from "./PropertyNoResults";
import PropertyPagination from "./PropertyPagination";
import TanguarHaorHouseboat from "../../pre-footer-content/Tangua";
import LoadingSpinner from "@/utils/LoadingSpinner";
import Banner from "../Banner/Banner";

export default function PropertyList({ id }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { currentPage, handlePageChange, setCurrentPage } = usePagination();
  const [data, setData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [price, setPrice] = useState(10000);
  const [sortOption, setSortOption] = useState("1");
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [propertyNames, setPropertyNames] = useState([]);

  const itemsPerPage = 10;

  // Fetch property data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const locationId = id;
        const result = await propertySummary(locationId);
        setData(result);
        
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

  // Fetch popular property data when sort option changes to "Most Popular"
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

  // Normalize string for search
  const normalizeString = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  };

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

    return [...data].sort((a, b) => {
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);

      if (priceA === Infinity && priceB === Infinity) return 0;
      if (priceA === Infinity) return 1;
      if (priceB === Infinity) return -1;

      return sortOption === "2" ? priceA - priceB : priceB - priceA;
    });
  }, [data, sortOption, popularData]);

  // Filter data
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClearSearch = () => {
    const previousScrollPosition = window.scrollY;
    setSearchTerm("");
    setCurrentPage(1);
    setTimeout(() => {
      window.scrollTo(0, previousScrollPosition);
    }, 0);
  };

  const handleCardClick = (index) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    sessionStorage.setItem("lastViewedCardIndex", index);
    sessionStorage.setItem("currentPage", currentPage);
  };

  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div className="w-full pt-[40px] md:pt-[50px] relative">
        <Banner id={id} />
        
        {/* Filters Overlay - LG devices only */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10">
          <div className="container mx-auto px-4">
            <PropertyFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              propertyNames={propertyNames}
              setCurrentPage={setCurrentPage}
              price={price}
              setPrice={setPrice}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container w-[85%] mx-auto px-4 pt-16 lg:pt-24"> {/* Added padding to account for overlap */}
        {/* Mobile Filters (shown only on smaller screens) */}
        <div className="lg:hidden mb-6">
          <PropertyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            propertyNames={propertyNames}
            setCurrentPage={setCurrentPage}
            price={price}
            setPrice={setPrice}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {initialLoadComplete && filteredData.length === 0 && (
              <PropertyNoResults
                searchTerm={searchTerm}
                onReset={handleClearSearch}
              />
            )}

            {paginatedData.map((property, index) => (
              <PropertyCard
                key={property.property_id}
                property={property}
                index={index}
                onCardClick={handleCardClick}
              />
            ))}
          </>
        )}

        {filteredData.length > 0 && (
          <PropertyPagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        )}

        <TanguarHaorHouseboat />
      </div>
    </div>
  );

}