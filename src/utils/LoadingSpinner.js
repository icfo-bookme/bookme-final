const LoadingSpinner = () => (
   <div className="flex flex-col gap-4 h-64 justify-center items-center">
    <div className="w-64 h-4 bg-gray-300 animate-pulse rounded" />
    <div className="w-48 h-4 bg-gray-300 animate-pulse rounded" />
    <div className="w-56 h-4 bg-gray-300 animate-pulse rounded" />
  </div>
);

export default LoadingSpinner;