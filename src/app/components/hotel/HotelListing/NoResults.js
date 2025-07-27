import Link from 'next/link';

const NoResults = ({ hasFilters, onResetFilters }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i className="fa-solid fa-hotel text-3xl text-gray-400"></i>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">No hotels found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {hasFilters
          ? "No hotels match your selected filters. Try adjusting your filters."
          : "We could not find any hotels matching your criteria. Try adjusting your search filters or dates."}
      </p>
      <button
        onClick={onResetFilters}
        className="mt-4 inline-block px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-2"
      >
        Clear Filters
      </button>
      <Link
        href="/hotel"
        className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Modify Search
      </Link>
    </div>
  );
};

export default NoResults;