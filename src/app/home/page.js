"use client"
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Flight');
  const [tripType, setTripType] = useState('One Way');
  const [travelers, setTravelers] = useState(1);

  const tabs = ['Flight', 'Hotel', 'Shop', 'Holiday', 'Visa', 'Mobile Recharge', 'Pay Bill'];
  const tripTypes = ['One Way', 'Round Trip', 'Multi City'];

  return (
    <div className="min-h-screen relative">
      <Head>
        <title>ShareTrip - Find Flights, Hotels, Visa & Holidays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background Video */}
      <div className="fixed inset-0 -z-10">
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
        >
          <source src="/travel-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative pt-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 space-x-4">
          {/* <Image 
            src="/logo.png" 
            alt="ShareTrip Logo"
            className="h-12 w-auto" 
            fill
          /> */}
          <div>
            <h1 className="text-4xl font-bold text-white">Welcome to ShareTrip!</h1>
            <p className="text-xl text-white/90 mt-1">Find Flights, Hotels, Visa & Holidays</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-semibold ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Flight Tab Content */}
          {activeTab === 'Flight' && (
            <div className="p-6">
              {/* Trip Type Row */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  {tripTypes.map((type) => (
                    <button
                      key={type}
                      className={`px-5 py-2 rounded-md text-sm font-medium ${
                        tripType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setTripType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {travelers} Traveller{travelers !== 1 && 's'}
                </div>
              </div>

              {/* Location Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* From */}
                <div className="border rounded-lg p-4 hover:border-blue-600 cursor-pointer">
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="text-lg font-bold text-gray-900 mb-1">DAC</p>
                  <p className="text-xs text-gray-500 leading-4">
                    Dhaka Bangladesh, Hazrat Shahjali International
                  </p>
                </div>

                {/* To */}
                <div className="border rounded-lg p-4 hover:border-blue-600 cursor-pointer">
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <p className="text-lg font-bold text-gray-900 mb-1">CXB</p>
                  <p className="text-xs text-gray-500 leading-4">
                    Cox’s Bazar Bangladesh, Cox’s Bazar Airport (CXB)
                  </p>
                </div>

                {/* Date */}
                <div className="border rounded-lg p-4 hover:border-blue-600 cursor-pointer">
                  <p className="text-xs text-gray-500 mb-1">Departure</p>
                  <p className="text-lg font-bold text-gray-900 mb-1">23</p>
                  <p className="text-xs text-gray-500 leading-4">
                    April Wednesday, 2025
                  </p>
                </div>
              </div>

              {/* Fare Options */}
              <div className="flex space-x-4 border-t pt-4">
                <button className="text-blue-600 font-medium text-sm hover:underline">
                  Regular Fare
                </button>
                <button className="text-gray-600 font-medium text-sm hover:underline">
                  Student Fare
                </button>
              </div>
            </div>
          )}

          {/* Other Tabs Content */}
          {activeTab !== 'Flight' && (
            <div className="p-6 min-h-[400px] flex items-center justify-center">
              <p className="text-gray-500 text-lg">{activeTab} section under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}