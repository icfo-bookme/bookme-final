const ErrorMessage = ({ error }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading rooms: {error}
    </div>
);

export default ErrorMessage;