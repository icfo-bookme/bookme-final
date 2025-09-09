import HotelSearch from "../../SearchBar/Hotels/HotelSearch";

const HotelHeroSection = () => {
  return (
    <section className="relative">
      <div
        className="h-[30vh] md:h-[60vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/image.png')",
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative h-full hidden md:flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-4xl md:text-3xl font-bold mb-2 sm:mb-4">
            A place to call home on your next adventure
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl">
            Choose from houses, villas, cabins, and more
          </p>
        </div>
      </div>

      {/* Search form positioned over hero image */}
      <div className="max-w-6xl mx-auto px-4 xs:px-6">
        <div className="relative -mt-36 lg:-mt-20 z-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 py-4 sm:py-6 px-3 sm:px-4">
            <HotelSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelHeroSection;