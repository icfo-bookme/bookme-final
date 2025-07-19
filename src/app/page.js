import { Roboto } from "next/font/google";
import Banner from "./components/Home/Banner";
import Visa from "./components/Home/Visa";
import Tangour from "./components/Home/Tangour";
import Sundarban from "./components/Home/sundarban";
import SaintMartin from "./components/Home/SaintMartin";
import PromotionsPage from "./components/Home/PromotionsPage";
import getServicesData from "@/services/homepage/getServicesData";
import HpmepageBlog from "./components/pre-footer-content/Homepage";
import TravelSearchWidget from "./components/SearchBar/SearchBar";

// Optional: ensure server-side rendering
export const dynamic = "force-dynamic";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default async function Home() {
  let servicesData = [];

  try {
    servicesData = await getServicesData();
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  const shouldShowVisa = servicesData?.some(
    (item) => item?.category_name === "Visa" && item?.isShow === "yes"
  );

  const shouldShowTour = servicesData?.some(
    (item) => item?.category_name === "Tour" && item?.isShow === "yes"
  );

  const shouldShowTangour = servicesData?.some(
    (item) => item?.category_name === "Tanguar Haor" && item?.isShow === "yes"
  );

  const shouldShowSundarban = servicesData?.some(
    (item) => item?.category_name === "Sundarban" && item?.isShow === "yes"
  );

  const shouldShowSaintMartin = servicesData?.some(
    (item) => item?.category_name === "Saint Martin Ships" && item?.isShow === "yes"
  );

  return (
    <main className={roboto.className}>
      {/* Hero Section with Banner and Search Widget */}
      <section className="relative w-full min-h-[67vh] md:min-h-[80vh]">
        {/* Banner Background */}
        <div className="absolute inset-0 w-full h-full">
          <Banner />
        </div>

        {/* Search Widget Container */}
        <div className=" relative md:top-96 top-36   z-10 h-full flex items-center justify-center ">
          <div className="w-full  md:max-w-5xl md:-mt-24 lg:-mt-32">
            <TravelSearchWidget />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-5  bg-white">
        <div className=" mx-auto  ">
          <div className="overflow-hidden">
            {servicesData.length > 0 ? (
              <>
                <PromotionsPage servicesData={servicesData} />

                {shouldShowVisa && <Visa />}

                {shouldShowTour && (
                  <>
                    {shouldShowTangour && <Tangour />}
                    {shouldShowSundarban && <Sundarban />}
                    {shouldShowSaintMartin && <SaintMartin />}
                  </>
                )}
              </>
            ) : (
              <p className="text-center text-red-500 py-10">
                Failed to load services data. Please try again later.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50">
        <HpmepageBlog />
      </section>
    </main>
  );
}