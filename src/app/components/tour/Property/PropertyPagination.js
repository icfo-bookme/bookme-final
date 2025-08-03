import Pagination from "../Pagination/Pagination";

export default function PropertyPagination({ currentPage, handlePageChange, totalPages }) {
  return (
    <Pagination
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
    />
  );
}