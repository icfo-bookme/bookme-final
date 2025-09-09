const HotelLoadingSkeleton = () => {
  return (
    <div className="min-h-screen font-sans">
   
      <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-300 animate-pulse" />

      <div className="bg-white py-6 sm:py-8">
        <main className="container mx-auto px-4 sm:px-6 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 sm:h-12 bg-gray-200 rounded animate-pulse" />
            ))}
            <div className="w-28 sm:w-32 h-8 sm:h-10 bg-gray-300 rounded animate-pulse mx-auto" />
          </div>
        </main>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">
          Best Hotels for Your Next Trip
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-40 sm:h-48 bg-gray-300 w-full"></div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-1 sm:space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
                  ))}
                </div>
                <div className="h-4 sm:h-5 bg-gray-300 rounded w-1/4 mt-1 sm:mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelLoadingSkeleton;