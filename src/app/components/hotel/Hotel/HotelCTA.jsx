import Link from 'next/link';
import { MdAddIcCall } from 'react-icons/md';
import { RiWhatsappFill } from 'react-icons/ri';

const HotelCTA = () => {
  return (
    <section className="bg-blue-50 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
        Cannot find what you are looking for?
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
        Our travel experts can help you find the perfect accommodation for your needs.
      </p>
      <Link
        href="/contact"
        className=" flex item-center justify-center w-96 mx-auto px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200"
        style={{ background: "linear-gradient(90deg, #313881, #1678B4)" }}
      >
        Contact Our Travel Experts
         <MdAddIcCall size={30} className="ml-2 text-green-200 " />
         <RiWhatsappFill size={30} className="ml-2 text-green-200 " />
        
      </Link>
    </section>
  );
};

export default HotelCTA;
