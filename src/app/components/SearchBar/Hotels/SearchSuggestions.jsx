'use client';

import React from "react";
import { FaHotel, FaMapMarkerAlt } from "react-icons/fa";

const highlightMatches = (text, query) => {
  if (!query || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const result = [];
  let lastIndex = 0;

  const matchPos = lowerText.indexOf(lowerQuery);
  if (matchPos !== -1) {
    if (matchPos > 0) {
      result.push(text.substring(0, matchPos));
    }
    result.push(
      <span key={matchPos} className="font-bold text-blue-600">
        {text.substring(matchPos, matchPos + lowerQuery.length)}
      </span>
    );
    lastIndex = matchPos + lowerQuery.length;
  }

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result.length > 0 ? result : text;
};

const SearchSuggestions = ({ suggestions, showSuggestions, searchQuery, onSelectItem, onClose }) => {
  if (!showSuggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute z-30 mt-1  bg-white w-72 border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
      {suggestions.map((item) => (
        <div
          key={item.type === 'hotel' ? `hotel-${item.hotel_id}` : `dest-${item.id}`}
          className="p-3 w-full hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-start "
          onClick={() => onSelectItem(item)}
        >
          <div className="mr-3 mt-1 text-gray-400">
            {item.type === 'hotel' ? (
              <FaHotel className="text-blue-500" />
            ) : (
              <FaMapMarkerAlt className="text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-blue-900 ">
              {highlightMatches(
                item.type === 'hotel' ? item.hotel_name : item.name,
                searchQuery
              )}
              {item.type === 'hotel' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Hotel
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {highlightMatches(
                item.type === 'hotel' ? item.street_address : item.country,
                searchQuery
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;