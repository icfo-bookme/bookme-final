// checked
import getFlightRoutes from "@/services/Flight/getFlightRoute";
import { Tab } from "../../Flight/Routes/Tab";

export default async function FlightRoute({homepage = 'true'}) {
  const flightdomesticRoutes = await getFlightRoutes('domestic');
  const flightinternationalRoutes = await getFlightRoutes('international');

  return (
    <div className="min-h-screen  bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <div className="w-full text-center mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-[#00026E] mb-2">
              Top Flight Deals
            </h2>
            <div className="w-20 h-1 bg-[#0678B4] mx-auto"></div>
          </div>

        </div>

        <Tab homepage={homepage} flightRoutes={{ domestic: flightdomesticRoutes, international: flightinternationalRoutes }} />
      </div>
    </div>
  );
}