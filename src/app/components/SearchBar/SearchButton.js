const SearchButton = ({ children }) => (
  <button className="px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50">
    {children}
  </button>
);

export default SearchButton;