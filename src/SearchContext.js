"use client";
import { createContext, useContext, useState } from "react";

// Create Context
const SearchContext = createContext();

// Create Provider Component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for consuming context
export const useSearch = () => useContext(SearchContext);
