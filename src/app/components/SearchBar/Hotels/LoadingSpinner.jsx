'use client';

import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="max-w-5xl rounded-t-lg mx-auto pb-6 text-blue-950 relative">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl shadow-sm bg-gray-100 p-4">
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="col-span-2 sm:col-span-1 space-y-1">
          <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="absolute text-sm md:text-lg mt-3 md:mt-6 left-1/2 -translate-x-1/2">
          <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;