import TourSearch from "../../SearchBar/Tour/TourSearch";
const HeroSection = () => {
  return (
    <section className="relative">

      <div className="relative h-[30vh] md:h-[60vh] w-full overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/tourpackages.jpg')",
          }}
        >

          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
            Discover Your Perfect Tour Package
          </h1>
          <p className="text-sm md:text-md max-w-2xl mx-auto drop-shadow-md">
            Explore breathtaking destinations with our carefully curated tour packages
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 xs:px-6">
        <div className="relative -mt-20 md:-mt-24 lg:-mt-20 z-10 transform transition-all duration-300 hover:shadow-lg">
          <div className="bg-white rounded-xl  border border-gray-200 py-4 sm:py-6 px-4 sm:px-6">
            <TourSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;