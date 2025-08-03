"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearch, IoClose } from "react-icons/io5";

export default function PropertySearch({
  searchTerm,
  setSearchTerm,
  propertyNames,
  setCurrentPage,
  onFocusChange
}) {
  const { register, handleSubmit } = useForm();
  const searchInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLgDevice, setIsLgDevice] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsLgDevice(window.innerWidth >= 1024);
    };

    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

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

  const normalizeString = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  };

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

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = suggestion;
    }
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (!isLgDevice) {
      onFocusChange(true);
    }
    if (searchTerm && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isLgDevice) {
        onFocusChange(false);
      }
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="flex-1 relative">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <label 
          htmlFor="property-search"
          className="block  font-medium text-gray-700 mb-1"
        >
          Search properties by name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register("property")}
            id="property-search"
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type property name..."
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <IoClose className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute z-30 w-full mt-1 text-black bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
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
  );
}