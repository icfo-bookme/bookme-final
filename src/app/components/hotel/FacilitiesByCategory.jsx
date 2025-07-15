"use client";
import React from "react";
import { FaCheck } from "react-icons/fa"; // Always use this icon

const FacilitiesByCategory = ({ categories }) => {
  console.log("FacilitiesByCategory categories:", categories);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {categories.map((category, idx) => (
        <div key={idx}>
          <h3 className="font-bold text-lg text-blue-950 mb-2">
            {category.category_name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {category.features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <FaCheck className="text-blue-500" />
                <span>{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilitiesByCategory;
