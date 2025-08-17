'use client';

import React from "react";

const GuestInput = ({ adults, children, rooms, onClick }) => {
  const guestText = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;

  return (
    <div className="col-span-2 sm:col-span-1 space-y-1">
      <label className="block text-sm font-medium text-blue-950">GUEST & ROOMS</label>
      <div
        onClick={onClick}
        className="p-3 h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors bg-white flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="font-medium text-blue-950">{guestText}</span>
      </div>
    </div>
  );
};

export default GuestInput;