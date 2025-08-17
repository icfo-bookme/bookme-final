'use client';

import React from "react";

const formatDate = (date) =>
  date?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).replace(",", "") || "";

const DateInput = ({ label, date, onClick }) => {
  return (
    <div className="space-y-1 relative">
      <label className="block text-sm font-medium text-blue-950">{label}</label>
      <div
        onClick={onClick}
        className="p-3 h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors bg-white flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium text-blue-950">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default DateInput;