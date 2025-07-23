"use client";
import React from "react";
import { FaCheck } from "react-icons/fa";

const FacilitiesByCategory = ({ categories }) => {
  return (
    <div className="w-[98%] mx-auto space-y-6 bg-white p-6 rounded-lg ">
      {categories.map((category, idx) => (
        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
          <h3 className="font-bold text-lg text-blue-950 mb-3">
            {category.category_name}
          </h3>
          <div className="flex flex-wrap gap-3">
            {category.features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center space-x-2 border border-gray-300 text-sm text-gray-700 p-2 rounded transition-colors hover:bg-blue-200 hover:border-blue-400"
              >
                {feature.icon_class ? (
                  <i className={`${feature.icon_class} text-blue-950 text-sm w-4 flex justify-center`} />
                ) : (
                  <FaCheck className="text-blue-900" />
                )}
                <span className="whitespace-nowrap">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilitiesByCategory;