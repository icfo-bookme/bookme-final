"use client"
import { createContext, useState, useContext } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("currentPage");
      return savedPage ? parseInt(savedPage, 10) : 1;
    }
    return 1;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page.toString());
  };

  return (
    <PaginationContext.Provider value={{ currentPage, handlePageChange,setCurrentPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);