'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const metadata = {
  title: "Comprehensive Travel Guide | YourSite",
  description: "Detailed guide covering all aspects of international travel planning",
};

const HpmepageBlog = () => {
  const [expanded, setExpanded] = useState(false);

  const post = {
    title: "The Complete Guide to International Travel in 2024",
    excerpt: "Master the art of international travel with our exhaustive guide covering documents, packing, visas, and cultural tips.",
    image: "/global-travel.jpg",
    date: "June 25, 2024",
    readTime: "12 min read",
    author: "Travel Experts Team"
  };

  const handleToggle = () => setExpanded(prev => !prev);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl text-center font-bold text-blue-900 mb-4 leading-tight">
        {post.title}
      </h1>

      <div className="w-full h-80 relative rounded-lg overflow-hidden mb-8 border">
        <Image
          src={post.image}
          alt="World traveler holding passport and luggage"
          fill
          className="object-cover"
          quality={90}
          priority
        />
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b">
            Essential Travel Documents
          </h2>

          <p className="mb-4 text-gray-700">
            Discover the ultimate travel experience with BookMe&mdash;your all-in-one solution for exploring the beauty of Bangladesh and planning global adventures. Whether you&apos;re looking for a peaceful escape in the wetlands of Tanguar Haor or preparing for your first trip abroad, BookMe is your trusted partner. We provide a seamless platform where you can book everything&mdash;from luxury houseboats and cruise tickets to international flights, hotels, and visa services. Our mission is to make travel simple, affordable, and unforgettable for every type of traveler.
          </p>

          <p className={`${expanded ? 'block' : 'line-clamp-4'} transition-all text-gray-700 duration-300`}>
            Tanguar Haor is one of the most mesmerizing destinations in Bangladesh, and our exclusive houseboats like JolTori, Bojra, Doheem, and Bhela let you explore it in comfort and style. You&apos;ll enjoy air-conditioned rooms, local cuisine onboard, and panoramic rooftop views. For coastal escapes, we also offer cruises to Saint Martin and Sundarban with top-rated vessels including MV Karnafuly Express, MV The Crown, and Sea Pearl Cruise. Whether you&apos;re on a romantic getaway, a family vacation, or a group tour, BookMe connects you with the best ships and boats at unbeatable rates.
            <br /><br />
            Planning an international trip? BookMe offers fast, reliable, and affordable visa processing services for popular countries like France, Thailand, Canada, Australia, Germany, and more. Our experienced consultants guide you through every step&mdash;from document collection to embassy appointments&mdash;with an impressive 98% approval rate. In addition, we offer up to 50% off on seasonal packages, including winter specials, summer getaways, and last-minute deals. Just call 01967776777 to speak with a travel expert and start planning your dream trip today. BookMe is your trusted destination for safe, secure, and stress-free travel.
          </p>

          <button
            onClick={handleToggle}
            className="mt-4 text-blue-600 font-semibold hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? 'Read Less ▲' : 'Read More ▼'}
          </button>

          {expanded && (
            <>
              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Passport Requirements</h3>
              <ul className="list-disc text-gray-700 pl-6 mb-6 space-y-2">
                <li>Valid for at least 6 months beyond your return date</li>
                <li>Minimum 2 blank pages for visa stamps</li>
                <li>Undamaged with clear biometric photo</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Visa Considerations</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-blue-800 mb-2">Pro Tip:</p>
                <p className='text-gray-700'>
                  Check visa requirements at least 3 months before travel. Processing times vary dramatically&mdash;from same-day eVisas to 8+ weeks for some countries.
                </p>
              </div>
            </>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b">
            Packing Strategically
          </h2>
          <p className="mb-4 text-gray-700">
            Smart packing reduces stress and ensures you have what you need without excess baggage fees. Follow these guidelines:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6 text-gray-700">
            <div className="border rounded-lg p-4">
              <h4 className="font-bold mb-2">✓ Must-Pack Items</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Universal power adapter</li>
                <li>Portable charger</li>
                <li>Basic first aid kit</li>
                <li>Copies of important documents</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 text-gray-700">
              <h4 className="font-bold mb-2">✗ Avoid These</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Excessive liquids over 100ml</li>
                <li>Valuable jewelry</li>
                <li>Prohibited items (check airline rules)</li>
                <li>Single-use plastic items</li>
              </ul>
            </div>
          </div>
        </section>

        {/* You can continue more sections below if needed */}
      </div>
    </article>
  );
};

export default HpmepageBlog;
