"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Accordion } from "flowbite-react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Raleway } from "next/font/google";
import { TbWorld } from "react-icons/tb";
import { RiDiscussFill } from "react-icons/ri";
import {
  MdOutlineWatchLater,
  MdPolicy,
  MdTipsAndUpdates,
} from "react-icons/md";
import { LuInfo } from "react-icons/lu";
import { IoLocationSharp } from "react-icons/io5";

const raleway = Raleway({ subsets: ["latin"] });

const staticFacilityTypes = [
  "Summary",
  "Location",
  "Timing",
  "Inclusion & Exclusion",
  "Description",
  "Additional Information",
  "Travel Tips",
  "Policy",
];

const AccordionBookMe = ({ facilities = { facilities: [] } }) => {
  const [activeIndexes, setActiveIndexes] = useState(["Summary"]);
  const [activeTab, setActiveTab] = useState("Summary");
  const titleRefs = useRef({});
  const accordionRefs = useRef({});
  const contentRefs = useRef({});
  const tabsRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isScrollingRef = useRef(false);

  const groupedFacilities = useMemo(() => {
    return (facilities.facilities || []).reduce((acc, facility) => {
      if (staticFacilityTypes.includes(facility.facility_type)) {
        if (!acc[facility.facility_type]) {
          acc[facility.facility_type] = [];
        }
        acc[facility.facility_type] = acc[facility.facility_type].concat(
          facility.facilities
        );
      }
      return acc;
    }, {});
  }, [facilities]);

  const toggleAccordion = (facilityType) => {
    setActiveIndexes((prev) => {
      if (facilityType === "Summary") {
        if (prev.includes("Summary")) {
          return prev.filter((item) => item !== "Summary");
        } else {
          return ["Summary"];
        }
      }
      if (prev.includes(facilityType)) {
        return prev.filter((item) => item !== facilityType);
      } else {
        return [...prev, facilityType];
      }
    });

    if (facilityType === "Summary" && activeIndexes.includes("Summary")) {
      setActiveTab("Summary");
    } else {
      setActiveTab(facilityType);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);

      const tabsHeight = tabsRef.current?.offsetHeight || 0;

      Object.keys(accordionRefs.current).forEach((facilityType) => {
        const panel = accordionRefs.current[facilityType];
        const stickyTitle = titleRefs.current[facilityType];
        const isOpen = activeIndexes.includes(facilityType);

        if (panel && stickyTitle && isOpen) {
          const rect = panel.getBoundingClientRect();
          const shouldStick =
            rect.top < 110 + tabsHeight && rect.bottom > 80 + tabsHeight;

          if (shouldStick) {
            stickyTitle.style.willChange = "transform, opacity";
            stickyTitle.style.position = "fixed";
            stickyTitle.style.top = `${
              tabsHeight + (window.innerWidth <= 500 ? 55 : 85)
            }px`;
            stickyTitle.style.width = window.innerWidth <= 500 ? "100%" : "56%";
            stickyTitle.style.backgroundColor = "white";
            stickyTitle.style.zIndex = "40";
            stickyTitle.style.transition = "none";
            stickyTitle.style.transform = "translateY(0)";
            stickyTitle.style.opacity = "1";
            stickyTitle.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
          } else {
            stickyTitle.style.willChange = "";
            stickyTitle.style.position = "";
            stickyTitle.style.top = "";
            stickyTitle.style.width = "";
            stickyTitle.style.backgroundColor = "";
            stickyTitle.style.zIndex = "";
            stickyTitle.style.transition = "";
            stickyTitle.style.transform = "";
            stickyTitle.style.opacity = "";
            stickyTitle.style.boxShadow = "";
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndexes]);

  return (
    <div
      className={`${raleway.className} flex flex-col bg-white relative`}
      ref={containerRef}
    >
      {/* Sticky Tabs - Always stays at top */}
      <div
        ref={tabsRef}
        className="sticky-tabs bg-white w-full border-b"
        style={{
          position: "sticky",
          top: window.innerWidth > 500 ? "85px" : "55px",
          zIndex: 15,
          backgroundColor: "white",
          willChange: "transform",
        }}
      >
        <div className="flex text-blue-900 dark:bg-gray-100 w-full dark:text-gray-800 font-semibold gap-x-[30px] md:gap-x-[40px]">
          {["Summary", "Description"].map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                toggleAccordion(tab);
              }}
              className={`bg-white flex font-bold mx-[10px] items-center flex-shrink-0 cursor-pointer py-2 transition-colors duration-200${
                activeTab === tab
                  ? " bg-white text-[#00026E] md:mr-5"
                  : " dark:border-gray-300 dark:text-gray-600 md:mr-5"
              }`}
              style={{
                borderBottom: activeTab === tab ? "2px solid blue" : "none",
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Content */}
      <div className="flex flex-wrap gap-4">
        {staticFacilityTypes.map((facilityType, index) => {
          const isOpen = activeIndexes.includes(facilityType);
          const facilityItems = groupedFacilities[facilityType] || [];

          return (
            <div
              key={index}
              className="w-full cursor-pointer"
              ref={(el) => (accordionRefs.current[facilityType] = el)}
              data-facility-type={facilityType}
            >
              <Accordion alwaysOpen={false} className="border-0">
                <Accordion.Panel className="border-0">
                  <div
                    className="flex border-b justify-between w-full cursor-pointer items-center px-4 py-3"
                    onClick={() => toggleAccordion(facilityType)}
                    ref={(el) => (titleRefs.current[facilityType] = el)}
                  >
                    <div className="flex items-center">
                      {facilityType === "Summary" ? (
                        <TbWorld size={30} style={{ color: "#2a026e" }} />
                      ) : facilityType === "Description" ? (
                        <RiDiscussFill size={30} style={{ color: "#2a026e" }} />
                      ) : facilityType === "Travel Tips" ? (
                        <MdTipsAndUpdates
                          size={30}
                          style={{ color: "#2a026e" }}
                        />
                      ) : facilityType === "Policy" ? (
                        <MdPolicy size={30} style={{ color: "#2a026e" }} />
                      ) : facilityType === "Timing" ? (
                        <MdOutlineWatchLater
                          size={30}
                          style={{ color: "#2a026e" }}
                        />
                      ) : facilityType === "Additional Information" ? (
                        <LuInfo size={30} style={{ color: "#2a026e" }} />
                      ) : facilityType === "Inclusion & Exclusion" ? (
                        <LuInfo size={30} style={{ color: "#2a026e" }} />
                      ) : facilityType === "Location" ? (
                        <IoLocationSharp
                          size={30}
                          style={{ color: "#2a026e" }}
                        />
                      ) : null}
                      <span className="text-blue-950 text-xl font-bold ml-2">
                        {facilityType}
                      </span>
                    </div>
                    {isOpen ? (
                      <FaMinus className="text-black" size={20} />
                    ) : (
                      <FaPlus className="text-black" size={20} />
                    )}
                  </div>
                  <Accordion.Content
                    className="overflow-hidden p-[5px]"
                    style={{
                      transition:
                        "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      maxHeight: isOpen
                        ? `${
                            contentRefs.current[facilityType]?.current
                              ?.scrollHeight || 0
                          }px`
                        : "0px",
                    }}
                    ref={(el) =>
                      (contentRefs.current[facilityType] = { current: el })
                    }
                  >
                    <div className="py-2">
                      {facilityItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="text-[#00026E] text-sm mb-2"
                        >
                          <h1 className="font-bold mb-1">
                            {item.facility_name}
                          </h1>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .sticky-tabs {
          position: sticky;
          top: 0;
          width: 103%;
          z-index: 50;
          background-color: white;
        }
        @media screen and (max-width: 500px) {
          .sticky-tabs {
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AccordionBookMe;
