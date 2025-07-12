"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function VisaSearchForm({ countryData }) {
  const [departure, setDeparture] = useState(countryData[0]?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countryData);
  const [travelers, setTravelers] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const counterRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (counterRef.current && !counterRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = countryData.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countryData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const selectedCountry = countryData.find(country => country?.name === departure);
    if (!selectedCountry) return;
    router.push(`/visa/${selectedCountry?.id}`);
  };

  const currentCountryCode = countryData.find(country => country.name === departure)?.code || '';

  const incrementTravelers = () => setTravelers(prev => Math.min(prev + 1, 10));
  const decrementTravelers = () => setTravelers(prev => Math.max(prev - 1, 1));

  return (
    <form onSubmit={handleSearch} className="font-sans text-black relative -mt-32 md:-mt-20 w-full bg-white max-w-4xl px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-md mx-auto">
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
        <div className='flex flex-1 flex-col sm:flex-row gap-2 sm:gap-4'>

          {/* Searchable Dropdown */}
          <div className="relative border border-gray-200 px-3 py-2 rounded-lg flex-1 min-w-[150px]" ref={dropdownRef}>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 font-bold mr-2">{currentCountryCode}</span>
              <input
                type="text"
                placeholder="Select country"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                  setDeparture(e.target.value);
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full outline-none text-base md:text-[18px]"
              />
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={country?.id}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                        departure === country.name ? 'bg-blue-50' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeparture(country?.name);
                        setSearchQuery(country?.name);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-gray-500 font-bold mr-2 w-6">{country?.code}</span>
                      <span className="flex-1 truncate">{country?.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No country found</div>
                )}
              </div>
            )}
          </div>

          {/* Travelers Counter */}
          <div
            className="px-3 py-2 rounded-lg border border-gray-200 flex-1 min-w-[150px] relative h-[60px] cursor-pointer"
            onClick={() => setIsEditing(true)}
            ref={counterRef}
          >
            <div className="flex items-center w-full h-full text-black">
              <div className={`flex items-center w-full h-full transition-all duration-300 ${isEditing ? 'opacity-0 scale-95 absolute' : 'opacity-100 scale-100'}`}>
                <span className="font-semibold mr-2 text-lg">{String(travelers).padStart(2, '0')}</span>
                <div className="w-[1px] h-full bg-gray-700 mx-2"></div>
                <div className="flex flex-col">
                  <div className="font-bold text-gray-500">Travelers</div>
                  <div className="text-xs font-semibold">Bangladeshi</div>
                </div>
              </div>

              <div className={`flex items-center justify-center w-full h-full transition-all duration-300 ${isEditing ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementTravelers();
                    }}
                    className="w-[25px] h-[30px] flex justify-center items-center text-center text-3xl rounded-lg text-white font-bold"
                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                    disabled={travelers <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-bold mx-2 w-6 text-center">{String(travelers).padStart(2, '0')}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementTravelers();
                    }}
                    className="w-[25px] h-[30px] flex justify-center items-center text-center text-3xl rounded-lg text-white font-bold"
                    style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
                    disabled={travelers >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer min-w-[40px] sm:min-w-[50px] hover:bg-blue-600 transition-colors"
          style={{ background: "linear-gradient(90deg, #313881, #0678B4)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm4.293-4.293l5.414 5.414" />
          </svg>
        </button>
      </div>
    </form>
  );
}
