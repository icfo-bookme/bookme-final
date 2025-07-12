"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Accordion } from "flowbite-react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Raleway } from "next/font/google";
import { TbWorld } from "react-icons/tb";
import { RiDiscussFill } from "react-icons/ri";
import { MdOutlineWatchLater, MdPolicy, MdTipsAndUpdates } from "react-icons/md";
import { LuInfo } from "react-icons/lu";
import { IoLocationSharp } from "react-icons/io5";

const raleway = Raleway({ subsets: ["latin"] });

const staticFacilityTypes = [
  "Summary", "Location", "Timing", "Inclusion & Exclusion",
  "Description", "Additional Information", "Travel Tips", "Policy"
];

const AccordionBookMe = ({ facilities = { facilities: [] } }) => {
  const [activeIndex, setActiveIndex] = useState("Summary"); // Set "Summary" as the default open section
  const [activeTab, setActiveTab] = useState("Summary"); // Set "Summary" as the default active tab
  const tabsRef = useRef(null); // Ref for the tabs section
  const accordionRefs = useRef({}); // Refs for each accordion section
  const titleRefs = useRef({}); // Refs for each accordion title

  // Group facilities by type
  const groupedFacilities = useMemo(() => {
    return (facilities.facilities || []).reduce((acc, facility) => {
      if (staticFacilityTypes.includes(facility.facility_type)) {
        if (!acc[facility.facility_type]) {
          acc[facility.facility_type] = [];
        }
        acc[facility.facility_type] = acc[facility.facility_type].concat(facility.facilities);
      }
      return acc;
    }, {});
  }, [facilities]);

  // Toggle accordion
  const toggleAccordion = (facilityType) => {
    setActiveIndex((prev) => (prev === facilityType ? null : facilityType));
    setActiveTab(facilityType); // Sync tab with accordion
  };

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveIndex(tab); // Open the corresponding accordion
  };

  // Make tabs sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const thresholdHeight = 932; // Specific height threshold (e.g., 500px)
        const scrollPosition = window.scrollY;

        if (scrollPosition >= thresholdHeight) {
          // Add sticky class when scroll position is greater than or equal to the threshold
          tabsRef.current.classList.add("sticky1");
        } else {
          // Remove sticky class when scroll position is less than the threshold
          tabsRef.current.classList.remove("sticky1");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use IntersectionObserver to make accordion titles sticky
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const facilityType = entry.target.getAttribute("data-facility-type");
          const titleElement = titleRefs.current[facilityType];

          if (titleElement) {
            if (entry.isIntersecting) {
              // When the content is in view, make the title sticky
              titleElement.classList.add("sticky-section");
            } else {
              // When the content is out of view, remove the sticky behavior
              titleElement.classList.remove("sticky-title");
            }
          }
        });
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    // Observe each accordion content section
    Object.values(accordionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`${raleway.className} flex flex-col gap-4 mt-5 bg-white z-10`}>
      {/* Sticky Tabs */}
      <div ref={tabsRef} className="bg-white">
        <div className="flex text-blue-900 dark:bg-gray-100 dark:text-gray-800 font-semibold gap-x-[30px] md:gap-x-[40px]">
          {["Summary", "Description"].map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`bg-white flex font-bold mx-[10px] items-center flex-shrink-0 cursor-pointer py-2${
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
        <br />
        <hr />
      </div>

      {/* Accordion Container */}
      <div className="flex flex-wrap gap-4 mt-[25px]">
        {staticFacilityTypes.map((facilityType, index) => {
          const isOpen = activeIndex === facilityType;
          const facilityItems = groupedFacilities[facilityType] || [];

          return (
            <div
              key={index}
              className="w-full cursor-pointer mt-[10px]"
              ref={(el) => (accordionRefs.current[facilityType] = el)}
              data-facility-type={facilityType}
            >
              <Accordion alwaysOpen={false} className="border-0">
                <Accordion.Panel className="border-0">
                  {/* Custom Accordion Title (No Default Arrow) */}
                  <div
                    className="flex bg-white border-b justify-between w-full cursor-pointer items-center px-4 py-3"
                    onClick={() => toggleAccordion(facilityType)}
                    ref={(el) => (titleRefs.current[facilityType] = el)}
                  >
                    <div className="flex items-center sticky-section">
                      {facilityType === "Summary" ? (
                        <TbWorld style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Description" ? (
                        <RiDiscussFill style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Travel Tips" ? (
                        <MdTipsAndUpdates style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Policy" ? (
                        <MdPolicy style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Timing" ? (
                        <MdOutlineWatchLater style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Additional Information" ? (
                        <LuInfo style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Inclusion & Exclusion" ? (
                        <LuInfo style={{ color: "#2a026e" }} size={30} />
                      ) : facilityType === "Location" ? (
                        <IoLocationSharp style={{ color: "#2a026e" }} size={30} />
                      ) : null}

                      <span className="text-blue-950 text-xl font-bold ml-2 sticky-title">
                        {facilityType}
                      </span>
                    </div>
                    <div>
                      {isOpen ? <FaMinus className="text-black" size={20} /> : <FaPlus className="text-black" size={20} />}
                    </div>
                  </div>

                  {isOpen && (
                    <Accordion.Content>
                      {facilityItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-[#00026E] text-sm mb-2">
                          <h1 className="font-bold mb-1">{item.facility_name}</h1>
                          <div dangerouslySetInnerHTML={{ __html: item.value }} />
                        </div>
                      ))}
                    </Accordion.Content>
                  )}
                </Accordion.Panel>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccordionBookMe;