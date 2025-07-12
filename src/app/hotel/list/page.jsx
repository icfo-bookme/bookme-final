// app/hotel/list/page.jsx
import SearchBar from '@/app/components/hotel/SearchBar';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const HotelListPage = async ({ searchParams }) => {
    // Extract search parameters
    const { checkin, checkout, locationID, rooms, adult } = searchParams;

    // Validate required parameters
    if (!checkin || !checkout || !locationID) {
        redirect('/hotel');
    }

    // Fetch hotels from API
    const apiUrl = `https://bookme.com.bd/admin/api/hotel/listing/${locationID}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
        throw new Error('Failed to fetch hotels');
    }

    const hotels = await res.json();

    return (
        <div className="container mx-auto max-w-6xl p-4 pt-24 bg-white text-blue-950">
            {/* Search Bar Component */}
            <div className="mb-6 md:mb-8">
                <SearchBar
                    initialValues={{
                        checkin,
                        checkout,
                        locationID,
                        rooms: rooms || '1',
                        adults: adult || '2'
                    }}
                />
            </div>

            {/* Hotels Listing */}
            <div className='grid grid-cols-1 md:grid-cols-5 bg-gray-100 p-2 md:p-4 rounded-lg gap-4 md:gap-6 mb-8'>
                {/* Filters Sidebar - Hidden on mobile, shown on md and larger */}
                <div className='hidden md:block md:col-span-1 border-r border-gray-200 text-center text-gray-600 p-2'>
                    <div className="sticky top-24">
                        <h3 className="font-semibold mb-3">Filters</h3>
                        <p>Search functionality here will be implemented</p>
                    </div>
                </div>

                {/* Hotels List */}
                <div className="space-y-4 md:space-y-6 col-span-1 md:col-span-4">
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <div key={hotel.id} className="flex flex-col md:flex-row gap-4 p-3 md:p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                                {/* Hotel Image - Full width on mobile, 1/3 on desktop */}
                                <div className="w-full md:w-1/3 h-48 md:h-48 relative">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${hotel.img}`}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover rounded-lg"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority={false}
                                    />
                                </div>

                                {/* Hotel Details - Full width on mobile, 2/3 on desktop */}
                                <div className="w-full md:w-2/3 space-y-2 md:space-y-3">
                                    <div className="flex flex-col md:flex-row justify-between gap-2">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold">{hotel.name}</h3>
                                            <div className='flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600'>
                                                <div className='border border-gray-400 px-1 rounded-lg flex items-center gap-1'>
                                                    <i className="fa-solid fa-star text-yellow-400 text-xs"></i> 
                                                    <span>{hotel.star}</span>
                                                </div> 
                                                <p className="text-gray-600 flex items-center gap-1">
                                                    <i className="fa-solid fa-location-dot text-xs"></i> 
                                                    <span>{hotel.location}</span>
                                                </p>
                                            </div>
                                        </div> 
                                        <div className="text-left md:text-right">
                                            {hotel.discount && (
                                                <p className="text-xs md:text-sm text-gray-500 line-through">৳{hotel.regular_price}</p>
                                            )}
                                            <p className="text-lg md:text-xl font-bold text-blue-900">৳{hotel.price_after_discount}</p>
                                            {hotel.discount && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                    {hotel.discount}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    {hotel.summary && hotel.summary.length > 0 && (
                                        <div className="flex flex-wrap gap-1 md:gap-2 pt-1 md:pt-2">
                                            {hotel.summary.slice(0, 3).map((amenity) => (
                                                <span key={amenity.id} className="flex items-center text-xs md:text-sm bg-gray-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                                                    <i className={`${amenity.icon_class} mr-1 md:mr-2 text-blue-900 text-xs`}></i>
                                                    {amenity.name}
                                                </span>
                                            ))}
                                            {hotel.summary.length > 3 && (
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                                    +{hotel.summary.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* View Details Button */}
                                    <div className="flex pt-2 md:pt-0">
                                        <button className="w-full md:w-auto mt-2 px-4 py-1.5 md:px-6 md:py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors text-sm md:text-base">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 md:py-10 bg-white rounded-lg p-4">
                            <p className="text-base md:text-lg">No hotels found matching your criteria.</p>
                            <p className="text-gray-600 text-sm md:text-base">Try adjusting your search parameters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelListPage;