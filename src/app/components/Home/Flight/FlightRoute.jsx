import getFlightRoutes from "@/services/Flight/getFlightRoute";
import PrimaryButton from "@/utils/PrimaryButton";
import Image from "next/image";
import { FaPlane, FaClock, FaMapMarkerAlt, FaTag, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { Tab } from "../../Flight/Routes/Tab";

export default async function FlightRoute() {
  const flightdomesticRoutes = await getFlightRoutes('domestic');
  const flightinternationalRoutes = await getFlightRoutes('international');

  return (
    <div className="min-h-screen  bg-gradient-to-br from-sky-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-2">
            <FaPlane className="text-blue-600" size={36} />
             Top Flight Deals – Domestic & International
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover available flight paths with detailed information and exclusive discounts
          </p>
        </div>

        <Tab flightRoutes={{ domestic: flightdomesticRoutes, international: flightinternationalRoutes }} />
      </div>
    </div>
  );
}