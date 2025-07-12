import React from 'react';
import { FaPhone, FaFacebookMessenger, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Banner from '../components/Home/Banner';

const HotelDealsPage = () => {
  const contacts = {
    phone: '+8801967776777',
    whatsapp: '+8801967776777',
    email: 'bookmebdltd@gmail.com',
    address: '123 Travel Street, Dhaka, Bangladesh'
  };

  return (
    <div className="">
     <div className=" w-[100%] ">
            < Banner />
           </div>
      <div className='w-full flex items-center justify-center  bg-white rounded-xl shadow-lg overflow-hidden'>



      <div className="w-full max-w-4xl mx-auto ">
        {/* Header Section */}
        <div className=" pt-16 px-4 md:p-6 text-blue-950">
          <h1 className="text-2xl text-center sm:text-2xl md:text-4xl font-bold">
            Best Deals on Hotels, Cars & Flights
          </h1>
          <p className="mt-2 text-center text-gray-700">
            Contact us now for exclusive offers and instant solutions
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          {/* Contact Methods - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Call Button */}
            <a 
              href={`tel:${contacts.phone}`}
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-all duration-300 group"
            >
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <FaPhone className="text-green-600 text-2xl" />
              </div>
              <span className="mt-2 font-medium text-gray-800">Call Now</span>
              <span className="text-sm text-gray-600 mt-1">{contacts.phone}</span>
            </a>

            {/* WhatsApp Button */}
            <a 
              href={`https://wa.me/${contacts.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all duration-300 group"
            >
              <div className="bg-emerald-100 p-3 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                <FaWhatsapp className="text-emerald-600 text-2xl" />
              </div>
              <span className="mt-2 font-medium text-gray-800">WhatsApp</span>
              <span className="text-sm text-gray-600 mt-1">{contacts.whatsapp}</span>
            </a>

            {/* Messenger Button (shown only on lg+ screens) */}
            <a 
              href="https://m.me/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all duration-300 group"
            >
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                <FaFacebookMessenger className="text-blue-600 text-2xl" />
              </div>
              <span className="mt-2 font-medium text-gray-800">Messenger</span>
              <span className="text-sm text-gray-600 mt-1">Message Us</span>
            </a>

            {/* Email Button (shown only on lg+ screens) */}
            <a 
              href={`mailto:${contacts.email}`}
              className="hidden lg:flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-all duration-300 group"
            >
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                <FaEnvelope className="text-purple-600 text-2xl" />
              </div>
              <span className="mt-2 font-medium text-gray-800">Email Us</span>
              <span className="text-sm text-gray-600 mt-1">{contacts.email}</span>
            </a>
          </div>

          {/* Additional Contact Info (shown on small screens) */}
          <div className="lg:hidden space-y-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${contacts.email}`} className="text-blue-600">{contacts.email}</a>
              </div>
            </div>
            
            
          </div>

          {/* Messenger Button for small screens */}
          <div className="sm:hidden mt-4">
            <a 
              href="https://m.me/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all duration-300"
            >
              <FaFacebookMessenger className="text-blue-600 text-xl mr-3" />
              <span className="font-medium text-gray-800">Message us on Facebook</span>
            </a>
          </div>

          {/* Working Hours */}
          
        </div>
      </div>
    </div> 
  
    </div>
  );
};

export default HotelDealsPage;