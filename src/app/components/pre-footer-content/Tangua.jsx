'use client'
import React, { useState } from 'react';
import Image from 'next/image';

const TanguarHaorHouseboat = () => {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tanguar Haor Stories title */}
      <h2 className="text-lg md:text-3xl pb-4 pt-[50px] font-semibold text-[#00026E] mb-2 text-center">
        Tanguar Haor Stories
      </h2>
      
      {/* Full-width image at the top */}
      <div className="w-full lg:h-96 h-44 relative rounded-lg overflow-hidden mb-8">
        <Image
          src="/tour-details-banner.png"
          alt="Luxury houseboat in Tanguar Haor"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Main title */}
      <h1 className="text-xl md:text-[28px] font-bold text-gray-900 mb-6 text-center">
        Discover the Best Houseboats in Tanguar Haor – A Luxurious Floating Experience in Nature
      </h1>

      {/* Content */}
      <div className="prose prose-lg px-4 mx-auto text-gray-700">
        <p className="mb-4">
          If you&apos;re dreaming of a serene getaway surrounded by crystal-clear water, breathtaking landscapes, and unique biodiversity, Tanguar Haor in Bangladesh should be at the top of your travel list. Nestled in the Sunamganj district, this vast wetland is a UNESCO-recognized ecological hotspot. What makes Tanguar Haor even more special? The rising popularity of luxury houseboats that let you live on water in style. Whether you&apos;re looking for a romantic escape, a family retreat, or an adventurous journey with friends, a Tanguar Haor houseboat is an unforgettable experience.
        </p>
<div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🚤 Best Houseboats in Tanguar Haor</h3>
              <p className="mb-4">
                When it comes to choosing the best houseboat in Tanguar Haor, options are plentiful. Among the top-rated ones:
              </p>
              <p className="font-semibold mb-1">Bojra Houseboat</p>
              <p className="mb-3">A traditional yet elegant boat offering modern amenities with a vintage design. Perfect for group tours.</p>
              
              <p className="font-semibold mb-1">Falcon Houseboat</p>
              <p className="mb-3">Known for its sleek design, spacious rooms, and rooftop lounging area with a stunning view of the haor.</p>
              
              <p className="font-semibold mb-1">Sultan Houseboat</p>
              <p className="mb-3">A premium houseboat combining luxury, safety, and comfort. Ideal for those who want an elite experience.</p>
              
              <p className="mb-0">
                These houseboats come equipped with air-conditioned rooms, onboard dining, clean washrooms, and even Wi-Fi in some cases.
              </p>
            </div>
        {showFullContent && (
          <>
            

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">💰 Tanguar Haor Houseboat Price & Boat Rent</h3>
              <p className="mb-4">
                The Tanguar Haor houseboat price varies depending on size, facilities, and season. On average:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><span className="font-semibold">Standard Boats:</span> ৳8,000–৳15,000 per day</li>
                <li><span className="font-semibold">Premium Houseboats:</span> ৳20,000–৳40,000+ per day</li>
                <li><span className="font-semibold">Luxury Boats like Bojra, Falcon, or Sultan:</span> ৳40,000–৳70,000+ per night for group packages</li>
              </ul>
              <p className="mb-0">
                For Tanguar Haor boat rent, you can also hire smaller local boats (called nouka or dinghy boats) for half-day or full-day trips at much lower rates.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">📦 Tanguar Haor Tour Package</h3>
              <p className="mb-2">
                Looking for a stress-free trip? Many tour operators offer all-inclusive Tanguar Haor tour packages that include:
              </p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>Round-trip transport from Dhaka/Sylhet</li>
                <li>Houseboat stay (standard to luxury options)</li>
                <li>Local meals</li>
                <li>Campfire at night</li>
                <li>Guided haor exploration and birdwatching</li>
              </ul>
              <p className="mb-0">
                Custom packages can also be arranged based on your group size, travel dates, and budget.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🌊 Why Choose a Luxury or Premium Houseboat?</h3>
              <p className="mb-2">
                Unlike regular boat trips, staying on a premium houseboat offers:
              </p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>Privacy and comfort</li>
                <li>Chef-cooked local meals onboard</li>
                <li>Nighttime haor views under the stars</li>
                <li>Clean and secure lodging in the middle of the haor</li>
                <li>Access to hidden parts of the wetland</li>
              </ul>
              <p className="mb-0">
                If you&apos;re looking for a Bojra Houseboat, Falcon Houseboat, or Sultan Houseboat, booking early is recommended—especially during peak season (June to August).
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🌿 Explore টাঙ্গুয়ার হাওর (Tanguar Haor) Like Never Before</h3>
              <p className="mb-0">
                The local name, টাঙ্গুয়ার হাওর, represents more than just a location—it&apos;s a cultural and environmental treasure. Rich in migratory birds, freshwater fish, and rural life, it&apos;s a magical escape from the busy city. Whether you choose a standard boat or a luxury houseboat, the haor will leave you speechless.
              </p>
            </div>

            <div className="mb-4 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">🛥️ Final Words</h3>
              <p className="mb-2">
                A trip to Tanguar Haor isn&apos;t complete without experiencing a houseboat stay. From the majestic Bojra houseboat to the deluxe Sultan houseboat, every vessel offers a unique slice of heaven on water. Whether you&apos;re looking for a budget boat or the best houseboat of Tanguar Haor, the options are diverse and unforgettable.
              </p>
              <p className="mb-0">
                Planning a serene escape to Tanguar Haor? Discover the beauty of nature aboard the best houseboat in Tanguar Haor. Whether you&apos;re looking for a luxury houseboat or a budget-friendly option, traveltangua.com has you covered. Compare the Tanguar Haor houseboat price, explore top-rated boats, and enjoy hassle-free booking—all in one place. From the best houseboat of Tanguar Haor to personalized tour packages, we bring you the ultimate wetland adventure. Don&apos;t miss out on this unique floating experience. Visit traveltangua.com today and plan your dream trip with ease and confidence!
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

export default TanguarHaorHouseboat;