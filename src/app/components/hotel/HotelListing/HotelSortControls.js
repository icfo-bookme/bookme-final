const HotelSortControls = ({ sortOption, onSortChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
      <select
        className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={sortOption}
        onChange={onSortChange}
      >
        <option value="recommended">Recommended</option>
        <option value="price-high-low">Price (High to Low)</option>
        <option value="price-low-high">Price (Low to High)</option>
        <option value="star-rating">Star Rating</option>
      </select>
    </div>
  );
};

export default HotelSortControls;