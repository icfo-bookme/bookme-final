'use client'
import React, { useState } from 'react';
import Image from 'next/image';

const VisaAgency = () => {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-10 sm:px-6 lg:px-8">
      {/* Visa Services title */}
      <h2 className="text-lg md:text-3xl pb-4 pt-[50px] font-semibold text-[#00026E] mb-2 text-center">
        Professional Visa Services
      </h2>
      
      {/* Full-width image at the top */}
      <div className="w-full lg:h-96 h-44 relative rounded-lg overflow-hidden mb-8">
        <Image
          src="/visa.jpg"
          alt="Visa and passport documents"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Main title */}
      <h1 className="text-xl md:text-[28px] font-bold text-gray-900 mb-6 text-center">
        Trusted Visa Processing Agency – Your Gateway to Global Travel
      </h1>

      {/* Content */}
      <div className="prose prose-lg px-4 mx-auto text-gray-700">
        <p className="mb-4">
          Planning international travel but overwhelmed by visa requirements? Our professional visa agency simplifies the entire process, ensuring smooth and successful visa applications for all destinations. Whether you&apos;re traveling for tourism, business, study, or immigration, we provide expert guidance and hassle-free processing for countries worldwide.
        </p>

        <div className="mb-4 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">🌍 Our Visa Services</h3>
          <p className="mb-4">
            We specialize in visa processing for all major destinations:
          </p>
          
          <p className="font-semibold mb-1">Tourist Visas</p>
          <p className="mb-3">From Schengen to US tourist visas, we handle documentation, appointments, and follow-ups.</p>
          
          <p className="font-semibold mb-1">Student Visas</p>
          <p className="mb-3">Comprehensive support for study abroad programs including documentation and interview preparation.</p>
          
          <p className="font-semibold mb-1">Work Visas</p>
          <p className="mb-3">Expert assistance with work permits and employment-based visas for various countries.</p>
          
          <p className="mb-0">
            We also provide urgent visa processing, document translation, and travel insurance services.
          </p>
        </div>

        {showFullContent && (
          <>
            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">💰 Visa Processing Fees</h3>
              <p className="mb-4">
                Our service fees are transparent and competitive:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><span className="font-semibold">Schengen Visa:</span> $80–$150 service fee</li>
                <li><span className="font-semibold">US Visa:</span> $100–$200 (excluding MRV fee)</li>
                <li><span className="font-semibold">UK Visa:</span> $70–$120 service fee</li>
                <li><span className="font-semibold">Student Visas:</span> $150–$300 depending on country</li>
              </ul>
              <p className="mb-0">
                Government fees are additional and vary by country and visa type.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">⏱️ Processing Times</h3>
              <p className="mb-2">
                Standard processing times (excluding embassy processing):
              </p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>Document preparation: 3-5 working days</li>
                <li>Appointment scheduling: Within 1 week for most countries</li>
                <li>Urgent processing available for most visa types</li>
              </ul>
              <p className="mb-0">
                We monitor your application status until passport return.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">✅ Why Choose Our Visa Agency?</h3>
              <p className="mb-2">
                We stand out because:
              </p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>98% approval rate for properly documented applications</li>
                <li>Former visa officers on our consultant team</li>
                <li>Personalized service with a dedicated case manager</li>
                <li>Up-to-date knowledge of changing visa policies</li>
                <li>Document verification before submission</li>
              </ul>
              <p className="mb-0">
                We&apos;ve helped over 10,000 clients obtain visas successfully.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">📝 Required Documents</h3>
              <p className="mb-2">
                While requirements vary by country, typical documents include:
              </p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>Valid passport (6+ months validity)</li>
                <li>Completed application forms</li>
                <li>Passport-sized photographs</li>
                <li>Financial documents</li>
                <li>Travel itinerary</li>
                <li>Supporting documents based on visa type</li>
              </ul>
              <p className="mb-0">
                We provide detailed checklists for each visa type.
              </p>
            </div>

           
          </>
        )}

        {/* Read More/Less button */}
        <div className="text-center mt-6">
          <button
            onClick={toggleContent}
            style={{
              background: "linear-gradient(90deg, #313881, #0678B4)",
            }}
            className="px-6 py-2 text-white rounded-md hover:bg-[#1E2D75] transition-colors duration-300"
          >
            {showFullContent ? 'Read Less' : 'Read More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaAgency;