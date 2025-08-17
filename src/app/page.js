import { Roboto } from "next/font/google";
import Banner from "./components/Home/Banner";
import Visa from "./components/Home/Visa";
import Tangour from "./components/Home/Tangour";
import Sundarban from "./components/Home/sundarban";
import SaintMartin from "./components/Home/SaintMartin";
import PromotionsPage from "./components/Home/PromotionsPage";
import getServicesData from "@/services/homepage/getServicesData";
import HpmepageBlog from "./components/pre-footer-content/Homepage";

import Hotel from "./components/Home/Hotel";
import HotelMain from "./components/Home/Hotel/Main";
import TravelBookingTabs from "./components/SearchBar/SearchBar";

export const dynamic = "force-dynamic";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

// Component mapping for main categories
const mainComponentMap = {
  "Visa": Visa,
  "Hotel":  HotelMain,
  "Ships": null, 
  "Flight": null 
};

// Sub-categories of Ships with their components
const ShipsSubComponents = {
  "Tanguar Haor": Tangour,
  "Sundarban": Sundarban,
  "Saint Martin Ships": SaintMartin
};

export default async function Home({searchParams}) {
  let servicesData = [];

  try {
    servicesData = await getServicesData();
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  // Sort servicesData by serialno
  const sortedServices = [...servicesData].sort((a, b) => {
    const aSerial = a.serialno ? parseInt(a.serialno) : Infinity;
    const bSerial = b.serialno ? parseInt(b.serialno) : Infinity;
    return aSerial - bSerial;
  });

  // Filter and get only the services that should be shown
  const visibleServices = sortedServices.filter(service => service.isShow === "yes");

  return (
    <main className={`${roboto.className} bg-blue-50`}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[60vh]">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <Banner />
        </div>

        {/* Search Widget - Centered Vertically */}
        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <TravelBookingTabs searchParams={searchParams} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-blue-50">
        <div className="w-full max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length > 0 ? (
            <>
              <PromotionsPage servicesData={servicesData} />

              {visibleServices.map((service) => {
                if (service.category_name === "Ships") {
                  const ShipsSubCategories = sortedServices
                    .filter(s => 
                      Object.keys(ShipsSubComponents).includes(s.category_name) && 
                      s.isShow === "yes"
                    )
                    .sort((a, b) => {
                      const aSerial = a.serialno ? parseInt(a.serialno) : Infinity;
                      const bSerial = b.serialno ? parseInt(b.serialno) : Infinity;
                      return aSerial - bSerial;
                    });

                  return ShipsSubCategories.map(subCategory => {
                    const SubComponent = ShipsSubComponents[subCategory.category_name];
                    return SubComponent ? <SubComponent key={subCategory.category_name} /> : null;
                  });
                }

                const Component = mainComponentMap[service.category_name];
                return Component ? <Component key={service.category_name} /> : null;
              })}
            </>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-blue-50 py-10">
        <div className="w-full max-w-screen-xl mx-auto px-4">
          <HpmepageBlog />
        </div>
      </section>
    </main>
  );}