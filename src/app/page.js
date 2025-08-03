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
import Hotel from "./components/Home/Hotel";

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
  const shouldShowHotel = servicesData?.some(
    (item) => item?.category_name === "Hotel" && item?.isShow === "yes"
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
    <main className={`${roboto.className} bg-white`}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh]  md:min-h-[60vh] ">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <Banner />
        </div>

        {/* Search Widget - Centered Vertically */}
        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <TravelSearchWidget />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 bg-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length > 0 ? (
            <>
              <PromotionsPage servicesData={servicesData} />

              {shouldShowVisa && <Visa />}
              {shouldShowHotel && <Hotel />}

              {shouldShowTour && (
                <>
                  {shouldShowTangour && <Tangour />}
                  {shouldShowSundarban && <Sundarban />}
                  {shouldShowSaintMartin && <SaintMartin />}
                </>
              )}
            </>
          ) : (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-white py-10">
        <div className="w-full max-w-screen-xl mx-auto px-4">
          <HpmepageBlog />
        </div>
      </section>
    </main>
  );
}
