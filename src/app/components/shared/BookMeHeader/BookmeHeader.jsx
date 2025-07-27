"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { useForm } from "react-hook-form";
import { useSearch } from "@/SearchContext";
import getContactNumber from "@/services/tour/getContactNumber";

import { FaPhone, FaWhatsapp, FaBars, FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { usePagination } from "@/services/tour/usePagination";
import { useRouter } from "next/navigation";
import getTourDestination from "@/services/getTourDestination";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

const BookMeHeader = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackageTourOpen, setIsPackageTourOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { currentPage, handlePageChange } = usePagination();
  const router = useRouter();
  const packageTourRef = useRef(null);

  const handleClick = () => {
    handlePageChange(1);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const togglePackageTour = () => {
    setIsPackageTourOpen(!isPackageTourOpen);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactResult = await getContactNumber();
        setContactNumber(contactResult);

        const destinationsData = await getTourDestination();
        if (destinationsData?.success) {
          setDestinations(destinationsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (packageTourRef.current && !packageTourRef.current.contains(event.target)) {
        setIsPackageTourOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = (data) => {
    setSearchTerm(data.property);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsPackageTourOpen(false);
  };

  return (
    <header className={`header-area-three ${roboto.className} bg-white`}>
      <div className="main-header fixed w-full z-50 bg-white shadow-md shadow-slate-500">
        <div className="header-bottom text-[#00026E]">
          <div className="container w-[95%] lg:w-[84%] mx-auto">
            <div className="flex justify-between items-center py-2">
              <div className="logo">
                <Link href={"/"} onClick={handleClick} className="cursor-pointer">
                  <Image
                    src="/assets/images/logo.png"
                    alt="logo"
                    width={130}
                    height={10}
                    className="changeLogo"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  href="/hotel"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  HOTEL
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  SHIP DETAILS
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  FLIGHT
                </Link>
 <Link
                  href="/visa"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  VISA
                </Link>
                {/* Package Tour with Dropdown */}
                <div className="relative group" ref={packageTourRef}>
                  <button
                    onClick={togglePackageTour}
                    className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    PACKAGE TOUR
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${isPackageTourOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPackageTourOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                      {destinations
                        .filter((destination) => destination.id !== 4) // Exclude destination with id 4
                        .map((destination) => (
                          <Link
                            key={destination.id}
                            href={`/tour/${destination.id}`}
                            className="block px-4 py-2 text-sm text-[#00026E] hover:bg-blue-50"
                            onClick={() => {
                              handleClick();
                              setIsPackageTourOpen(false);
                            }}
                          >
                            {destination.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>

               
                <Link
                  href="/contact"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  ACTIVITY
                </Link>

                <Link
                  href="/contact"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  CARS
                </Link>
              </div>

              {/* Desktop Contact Info */}
              <div className="ml-3 hidden lg:flex items-center justify-center gap-2">
                <div className="flex items-center">
                  <div className="flex items-center  mr-5">
                    <a target="_blank" href={`tel:${contactNumber?.Phone}`} className="w-[38px] h-[38px] -mr-4">
                      <div className="phone-call-nav md:w-[40px] md:h-[40px] w-[36px] h-[36px] ">
                        <FaPhone className="md:ml-[12px] md:mt-[12px] mt-[9px] ml-[10px]" />
                      </div>
                    </a>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${contactNumber?.Phone}`}
                      className="w-[38px] h-[38px] mx-[20px] "
                    >
                      <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border-nav md:w-[40px] md:h-[40px] w-[36px] h-[36px] ml-[15px]">
                        <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                      </span>
                    </Link>
                  </div>

                  <div>
                    <p className="text-sm text-gray-900">Call Anytime</p>
                    <h4 className="text-lg font-semibold">
                      <a href="#" className="text-gray-800">
                        {contactNumber?.Phone?.slice(3)}
                      </a>
                    </h4>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button and Icons */}
              <div className="lg:hidden flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <a target="_blank" href={`tel:${contactNumber?.Phone}`} className="w-[38px] h-[38px]">
                    <div className="phone-call w-[36px] h-[36px]">
                      <FaPhone className="mt-[9px] ml-[10px]" />
                    </div>
                  </a>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${contactNumber?.Phone}`}
                    className="w-[38px] h-[38px]"
                  >
                    <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border w-[36px] h-[36px]">
                      <FaWhatsapp className="w-[20px] h-[20px] text-white mt-[0px] ml-[0px]" />
                    </span>
                  </Link>
                </div>

                <button
                  onClick={toggleMobileMenu}
                  className="text-[#00026E] focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes className="w-6 h-6" />
                  ) : (
                    <FaBars className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-20 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMobileMenu}
          ></div>

          {/* Menu Content */}
          <div
            className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Menu Header */}
              <div className="flex justify-between p-4 border-b border-gray-200">
                <Link href="/" onClick={() => { handleClick(); closeMobileMenu(); }}>
                  <Image
                    src="/assets/images/logo.png"
                    alt="logo"
                    width={150}
                    height={5}
                    className="changeLogo"
                  />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-950 p-2 focus:outline-none hover:bg-white/10 rounded-full"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                  <li>
                    <Link
                      href="/hotel"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">Hotel</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">Ship Details</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">Flight</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/visa"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">VISA</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <div className="flex flex-col">
                      <button
                        onClick={togglePackageTour}
                        className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      >
                        <span className="font-medium">Package Tour</span>
                        <FaChevronRight className={`text-blue-400 transition-transform duration-200 ${isPackageTourOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {isPackageTourOpen && (
                        <div className="pl-4">
                          {destinations.filter((destination) => destination.id !== 4).map((destination) => (
                            <Link
                              key={destination.id}
                              href={`/tour/${destination.id}`}
                              className="flex items-center justify-between py-2 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                              onClick={closeMobileMenu}
                            >
                              <span className="font-medium">{destination.name}</span>
                              <FaChevronRight className="text-blue-400 opacity-70" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                  
                  <li>
                    <Link
                      href="/contact"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">Activity</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                   <li>
                    <Link
                      href="/contact"
                      className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      onClick={closeMobileMenu}
                    >
                      <span className="font-medium">Cars</span>
                      <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Contact Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#00026E] mb-3">Contact Us</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <a
                    target="_blank"
                    href={`tel:${contactNumber?.Phone}`}
                    className="flex items-center justify-center w-12 h-12 bg-[#00026E] rounded-full text-white hover:bg-[#00026E]/90 transition-colors"
                  >
                    <FaPhone className="text-xl" />
                  </a>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${contactNumber?.Phone}`}
                    className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors relative"
                  >
                    <span className="absolute animate-ping opacity-75 inline-flex h-full w-full rounded-full bg-green-400"></span>
                    <FaWhatsapp className="text-xl z-10" />
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Call Anytime</p>
                  <a
                    href={`tel:${contactNumber?.Phone}`}
                    className="text-lg font-semibold text-[#00026E] hover:underline"
                  >
                    {contactNumber?.Phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BookMeHeader;