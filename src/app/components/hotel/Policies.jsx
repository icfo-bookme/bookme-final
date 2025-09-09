'use client'
import React from 'react';

export default function HotelPolicies({ Policies }) {

  if (!Policies || Policies.length === 0) {
    return <p className="text-gray-500">No policy information available</p>;
  }

  return (
    <div className="space-y-6">
      {Policies.map((policy, index) => (
        <div key={index} className="grid grid-cols-12 gap-4">
          {policy.icon_class && (
            <div className="flex col-span-3 gap-3 align-center  mt-1">
              <i className={`${policy.icon_class} text-blue-500`}></i>
               <h3 className="font-semibold text-gray-800 -mt-1">{policy.name}</h3>
            </div> 
          )}
      
            <div 
              className="text-gray-600 col-span-9 mt-1 prose" 
              dangerouslySetInnerHTML={{ __html: policy.value }} 
            />
           
        
        </div>
      ))}
    </div>
  );
}