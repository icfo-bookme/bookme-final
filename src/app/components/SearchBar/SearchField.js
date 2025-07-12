const SearchField = ({ label, value, type = "text", defaultValue }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-blue-950">{label}</label>
    {type === "text" ? (
      <div className="p-3 border border-gray-300 rounded-lg bg-white text-blue-950">
        <div className="font-medium">{value}</div>
      </div>
    ) : (
      <input
        type={type}
        defaultValue={defaultValue}
        className="p-3 border border-gray-300 rounded-lg w-full text-blue-950"
      />
    )}
  </div>
);

export default SearchField;