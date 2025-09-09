"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const [visiblePages, setVisiblePages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const calculateVisiblePages = () => {
      const maxVisiblePages = window.innerWidth < 768 ? 3 : 5; // Show 3 pages on mobile, 5 on larger screens
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      setVisiblePages(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    };

    calculateVisiblePages();
    window.addEventListener("resize", calculateVisiblePages);
    return () => window.removeEventListener("resize", calculateVisiblePages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === "/") {
        handlePageChange(1);
      }
    };

    router.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router, handlePageChange]);

  return (
    <div className="flex justify-center items-center my-10">
      {/* Previous Button */}
      <button
        onClick={() => {
          handlePageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg  disabled:opacity-50"
        style={{
          background: "linear-gradient(90deg, #313881, #0678B4)",
        }}
      >
        Previous
      </button>

      {/* First Page Button */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 mx-1 text-sm font-medium ${
              currentPage === 1
                ? "text-white bg-blue-500"
                : "text-gray-700 bg-white"
            } border border-gray-300 rounded-lg `}
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-4 py-2 mx-1 text-sm text-gray-700">...</span>
          )}
        </>
      )}

      {/* Visible Page Buttons */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 mx-1 text-sm font-medium ${
            currentPage === page ? "text-black bg-blue-500" : "text-gray-700 bg-white"
          } border border-gray-300 rounded-lg `}
        >
          {page}
        </button>
      ))}

      {/* Last Page Button */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="mx-1">...</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 mx-1 text-sm font-medium ${
              currentPage === totalPages ? "text-black bg-blue-500" : "text-gray-700 bg-white"
            } border border-gray-300 rounded-lg `}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 text-sm font-medium text-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(90deg, #313881, #0678B4)",
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;