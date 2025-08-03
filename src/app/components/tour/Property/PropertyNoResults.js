export default function PropertyNoResults({ searchTerm, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-2xl font-bold text-gray-700 mb-4">
        No properties found
      </div>
      <p className="text-gray-500 mb-6">
        {searchTerm
          ? `No results found for "${searchTerm}"`
          : "No properties match your current filters"}
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}