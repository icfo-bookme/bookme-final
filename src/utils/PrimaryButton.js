const PrimaryButton = ({ children, onClick, type = "button", className = "", ...props }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      background: "linear-gradient(90deg, #313881, #0678B4)",
    }}
    className={`px-6 py-3 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
