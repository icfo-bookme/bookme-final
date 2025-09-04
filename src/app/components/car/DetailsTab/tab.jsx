"use client"
import { useState } from "react";

// Example: Define fallback content if no component is provided
function DefaultComponent({ model }) {
  return (
    <div className="p-4 text-gray-600">
      <h2 className="text-lg font-semibold">Model: {model.model_name}</h2>
      <p>No component specified for this model.</p>
    </div>
  );
}

export default function Tab({ models }) {
  const [activeTab, setActiveTab] = useState(models[0]?.id || null);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  const activeModel = models.find((model) => model.id === activeTab);
  const RenderComponent = activeModel?.Component || DefaultComponent;

  return (
    <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleTabClick(model.id)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              activeTab === model.id
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            {model.model_name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">
        <RenderComponent model={activeModel} />
      </div>
    </div>
  );
}
