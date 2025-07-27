import getAllHotels from '@/services/hotel/getAllHotels';
import Image from 'next/image';
import Link from 'next/link';
import HotelSearch from '../components/SearchBar/HotelSearch';
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaUtensils } from 'react-icons/fa';

export default async function HotelHome() {
    let hotelData = [];
    let loading = false;

    try {
        loading = true;
        const hotelResult = await getAllHotels();
        hotelData = hotelResult;
        loading = false;
    } catch (error) {
        console.error("Failed to fetch hotel data:", error);
        loading = false;
    }

    // Function to calculate discounted price
    const calculateDiscountedPrice = (originalPrice, discount) => {
        return Math.round(originalPrice - (originalPrice * discount) / 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen font-sans">
                {/* Background skeleton */}
                <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-300 animate-pulse" />

                {/* Search Form Skeleton */}
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

                {/* Grid Skeleton */}
                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">Popular Hotels</h2>
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
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Search Overlay */}
            <section className="relative">
                <div
                    className="h-[30vh]  md:h-[60vh] w-full bg-cover bg-center "
                    style={{
                        backgroundImage: "url('/hotel.jpg')",
                    }}
                >
                    <div className="absolute inset-0 "></div>
                    <div className="relative h-full hidden md:flex flex-col justify-center items-center text-center text-white px-4">
                        <h1 className="text-2xl sm:text-4xl md:text-3xl font-bold mb-2 sm:mb-4">
                            A place to call home on your next adventure
                        </h1>
                        <p className="text-sm xs:text-base sm:text-lg md:text-xl">Choose from houses, villas, cabins, and more</p>
                    </div>
                </div>

                {/* Search form positioned over hero image */}
                <div className="max-w-6xl mx-auto px-4 xs:px-6">
                    <div className="relative  -mt-36 lg:-mt-20 z-10">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 py-4 sm:py-6 px-3 sm:px-4">
                            <HotelSearch />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 xs:px-6 mt-12 sm:mt-16 lg:mt-20 pb-12 sm:pb-16">
                {/* Popular Hotels Section */}
                <section className="mb-12 sm:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
                        Popular Hotels
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {hotelData.map((hotel) => {
                            // Calculate prices
                            const originalPrice = Number(hotel.original_price) || hotel.lowest_price || 0;
                            const hasDiscount = hotel.discount > 0;
                            const discountedPrice = hasDiscount
                                ? calculateDiscountedPrice(originalPrice, hotel.discount)
                                : originalPrice;

                            return (
                                <div
                                    key={hotel.hotel_id}
                                    className="bg-gray-100 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    {/* Hotel Image */}
                                    <div className="relative h-40 sm:h-48 w-full">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${hotel.image}`}
                                            alt={hotel.hotel_name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority={hotel.sort_order === "1"}
                                        />
                                        {hasDiscount && (
                                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {hotel.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    {/* Hotel Info */}
                                    <div className="p-3 sm:p-4">
                                        <div className="flex justify-between items-start mb-1 sm:mb-2">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                                                {hotel.hotel_name}
                                            </h3>
                                            <div className="flex items-center text-yellow-700">
                                                <FaStar className="text-xs sm:text-sm mr-0.5 sm:mr-1" />
                                                <span className="text-xs sm:text-sm font-medium border p-1 rounded-lg bg-gray-200">{hotel.star_rating} star</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                                            <FaMapMarkerAlt className="mr-1 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{hotel.street_address}</span>
                                        </div>




                                        {/* Price Section */}
                                        <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-100">
                                            <div>
                                                {hasDiscount ? (
                                                    <>
                                                        <p className="text-2xs xs:text-xs text-gray-500 line-through">
                                                            {originalPrice.toLocaleString()} BDT
                                                        </p>
                                                        <p className="text-2xs xs:text-xs sm:text-sm text-red-500 font-medium">
                                                            Save {hotel.discount}%
                                                        </p>
                                                        <p className="text-base sm:text-lg font-bold text-blue-600">
                                                            {discountedPrice.toLocaleString()} BDT
                                                            <span className="text-2xs xs:text-xs font-normal text-gray-500"> / night</span>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-base sm:text-lg font-bold text-blue-600">
                                                        {originalPrice.toLocaleString()} BDT
                                                        <span className="text-2xs xs:text-xs font-normal text-gray-500"> / night</span>
                                                    </p>
                                                )}
                                            </div>
                                            <Link style={{
                                                background: "linear-gradient(90deg, #313881, #0678B4)",
                                            }}
                                                href={`/hotel/list/details/${hotel.hotel_id}`}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2  hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-blue-50 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                        Cant find what youre looking for?
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                        Our travel experts can help you find the perfect accommodation for your needs.
                    </p>
                    <button style={{
                background: "linear-gradient(90deg, #313881, #1678B4)",
            }} className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200">
                        Contact Our Travel Experts
                    </button>
                </section>
            </main>
        </div>
    );
}