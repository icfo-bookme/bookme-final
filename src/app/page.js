// checked
import { Roboto } from "next/font/google";
import { Suspense } from "react";
import Banner from "./components/Home/Banner";
import Tangour from "./components/Home/Tangour/Tangour";
import Sundarban from "./components/Home/sundarban/sundarban";
import SaintMartin from "./components/Home/Saintmartin/SaintMartin";
import PromotionsPage from "./components/Home/PromotionsPage";
import getServicesData from "@/services/homepage/getServicesData";
import HpmepageBlog from "./components/pre-footer-content/Homepage";
import HotelMain from "./components/Home/Hotel/Main";
import TravelBookingTabs from "./components/SearchBar/SearchBar";
import VisaMain from "./components/Home/Visa/Main";
import TangourMain from "./components/Home/Tangour/Main";
import LoadingSpinner from "./components/SearchBar/Hotels/LoadingSpinner";
import FlightRoute from "./components/Home/Flight/FlightRoute";
import CTASection from "./components/Home/CTASection/CTASection";
import Faq from "./components/Faq/Faq";

export const dynamic = "force-dynamic";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

const mainComponentMap = {
  Visa: VisaMain,
  Hotel: HotelMain,
  Ships: null,
  Flight: null,
};

const ShipsSubComponents = {
  "Tanguar Haor": TangourMain,
  Sundarban: Sundarban,
  "Saint Martin Ships": SaintMartin,
};

export default async function Home({ searchParams }) {
  let servicesData = [];

  try {
    servicesData = await getServicesData();
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  const sortedServices = [...servicesData].sort((a, b) => {
    const aSerial = a.serialno ? parseInt(a.serialno) : Infinity;
    const bSerial = b.serialno ? parseInt(b.serialno) : Infinity;
    return aSerial - bSerial;
  });

  const visibleServices = sortedServices.filter(
    (service) => service.isShow === "yes"
  );

  return (
    <main className={`${roboto.className} bg-blue-50`}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[60vh]">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="h-60 bg-gray-200 animate-pulse" />}>
            <Banner />
          </Suspense>
        </div>

        {/* Search Widget */}
        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <Suspense
              fallback={
                <LoadingSpinner />
              }
            >
              <TravelBookingTabs searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-blue-50">
        <div className="w-full max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length > 0 ? (
            <>
              <Suspense
                fallback={<div className="h-40 bg-gray-200 animate-pulse" />}
              >
                <PromotionsPage servicesData={servicesData} />
              </Suspense>

              {visibleServices?.map((service) => {
                if (service.category_name === "Ships") {
                  const ShipsSubCategories = sortedServices
                    .filter(
                      (s) =>
                        Object.keys(ShipsSubComponents).includes(
                          s.category_name
                        ) && s.isShow === "yes"
                    )
                    .sort((a, b) => {
                      const aSerial = a.serialno
                        ? parseInt(a.serialno)
                        : Infinity;
                      const bSerial = b.serialno
                        ? parseInt(b.serialno)
                        : Infinity;
                      return aSerial - bSerial;
                    });

                  return ShipsSubCategories.map((subCategory) => {
                    const SubComponent =
                      ShipsSubComponents[subCategory.category_name];
                    return SubComponent ? (
                      <Suspense
                        key={subCategory.category_name}
                        fallback={
                          <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
                        }
                      >
                        <SubComponent />
                      </Suspense>
                    ) : null;
                  });
                }

                const Component = mainComponentMap[service.category_name];
                return Component ? (
                  <Suspense
                    key={service.category_name}
                    fallback={
                      <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
                    }
                  >
                    <Component />
                  </Suspense>
                ) : null;
              })}
            </>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          )}
        </div>
      </section>
      <section>
        <FlightRoute />
      </section>

      <section className="">
        <CTASection />
      </section>

        <section className="">
        <Faq />
      </section>

      {/* Blog Section */}
      <section className="bg-blue-50 py-10">
        <div className="w-full max-w-screen-xl mx-auto px-4">
          <Suspense
            fallback={
              <div className="h-60 bg-gray-200 animate-pulse rounded-lg" />
            }
          >
            <HpmepageBlog />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
