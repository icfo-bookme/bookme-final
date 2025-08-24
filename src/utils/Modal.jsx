"use client";
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Box */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <div className="text-gray-600 mb-6">{children}</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
