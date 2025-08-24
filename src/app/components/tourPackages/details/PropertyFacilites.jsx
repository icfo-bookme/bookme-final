"use client";
import { useEffect, useState, useRef } from "react";
import * as IoIcons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import * as GoIcons from "react-icons/go";
import * as TbIcons from "react-icons/tb";
import ContactForm from "../../tour/ContactForm/ContactForm";
import Itineraries from "./itineraries";

const getIconComponent = (iconImportString) => {
  if (!iconImportString) return null;
  const match = iconImportString.match(/import\s+\{\s*(\w+)\s*\}\s+from\s+"react-icons\/(\w+)"/);
  if (!match) return null;
  const [, iconName, packageKey] = match;
  const iconPackages = { io5: IoIcons, fa: FaIcons, pi: PiIcons, go: GoIcons, tb: TbIcons };
  return iconPackages[packageKey.toLowerCase()]?.[iconName] || null;
};

export default function PropertyFacilities({ data }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionRefs = useRef({});
  const navRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Detect visible section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.entries(sectionRefs.current);
      let currentSection = null;

      for (let [id, el] of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.25 && rect.bottom >= 100) {
          currentSection = id;
          break;
        }
      }

      if (currentSection && currentSection !== activeCategory) {
        setActiveCategory(currentSection);
        window.history.replaceState(null, null, `#${currentSection}`);
      }

      // If at very top, force first category
      if (window.scrollY < 50 && sections.length > 0) {
        const firstId = sections[0][0];
        if (firstId !== activeCategory) {
          setActiveCategory(firstId);
          window.history.replaceState(null, null, `#${firstId}`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  // Horizontal nav scroll buttons for mobile
  useEffect(() => {
    const checkScrollButtons = () => {
      if (navRef.current && isMobile) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setShowPrev(scrollLeft > 0);
        setShowNext(scrollLeft < scrollWidth - clientWidth);
      }
    };
    checkScrollButtons();
    const navElement = navRef.current;
    navElement?.addEventListener("scroll", checkScrollButtons);
    return () => navElement?.removeEventListener("scroll", checkScrollButtons);
  }, [data, isMobile]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    document.getElementById(category)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, null, `#${category}`);
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === "next" ? 120 : -120,
        behavior: "smooth",
      });
    }
  };

  if (!data) {
    return <div className="p-5 text-gray-500">No property facilities available</div>;
  }

  // Categories order: itineraries second if exists
  const categories = data.facilities ? [...Object.keys(data.facilities)] : [];
  if (data.itineraries) {
    const existingIndex = categories.indexOf("itineraries");
    if (existingIndex > -1) categories.splice(existingIndex, 1);
    if (categories.length > 0) categories.splice(1, 0, "itineraries");
    else categories.push("itineraries");
  }

  return (
    <div className="py-5">
      {/* Sticky Nav */}
      <div className="sticky rounded-lg top-14 md:top-16 bg-white z-10 py-3 mb-6 border-b border-gray-200">
        <div className="relative px-2">
          {isMobile && showPrev && (
            <button
              onClick={() => scrollNav("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-20 "
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5  text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            ref={navRef}
            className={`flex space-x-2 pb-2 scroll-smooth ${isMobile ? "overflow-x-hidden" : "overflow-x-auto scrollbar-hide"}`}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  isMobile ? "flex-shrink-0 w-[calc(33.333%_-_0.5rem)]" : ""
                } ${
                  activeCategory === category
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="truncate block">
                  {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </button>
            ))}
          </div>

          {isMobile && showNext && (
            <button
              onClick={() => scrollNav("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="lg:grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {categories.map((category) => {
            if (category === "itineraries" && data.itineraries) {
              return (
                <section
                  key="itineraries"
                  id="itineraries"
                  ref={(el) => (sectionRefs.current["itineraries"] = el)}
                  className="scroll-mt-[130px]"
                >
                  <Itineraries itineraries={data.itineraries} />
                </section>
              );
            }
            if (data.facilities?.[category]) {
              return (
                <section
                  key={category}
                  id={category}
                  ref={(el) => (sectionRefs.current[category] = el)}
                  className="scroll-mt-[130px]"
                >
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {data.facilities[category].map((facility, index) => {
                        const IconComponent = getIconComponent(facility.icon);
                        return (
                          <div key={index} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                              <div className="flex items-center gap-2 sm:w-40 flex-shrink-0">
                                {IconComponent && (
                                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <IconComponent size={20} />
                                  </div>
                                )}
                                <h3 className="text-lg font-bold text-blue-950">
                                  {facility.name || category}
                                </h3>
                              </div>
                              <div
                                className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: facility.value }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      {/* Contact form section */}
        <div className="col-span-12 lg:col-span-3 mt-6 lg:mt-0">
          <div className="sticky top-36">
            <ContactForm
              category={"tourPackages"}
              propertyDetails={data?.property_name}
              headline={"Request For Custom Package"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
