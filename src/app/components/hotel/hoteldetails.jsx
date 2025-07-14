import getHotelDetails from "@/services/hotel/gethoteldetails";

export default async function HotelDetails({ hotelId }) {
    const hotelDetails = await getHotelDetails(hotelId);

    // Split the near_by string into an array of locations
    const nearbyLocations = hotelDetails.near_by 
        ? hotelDetails.near_by.split(',').map(loc => loc.trim()).filter(loc => loc)
        : [];

    console.log("Hotel Details:", hotelDetails);
    
    return (
        <div className="">
            <div className="container mx-auto">
                <h1 className="text-xl text-blue-950 font-bold">{hotelDetails.name}</h1>
                <div className='flex pt-1 flex-wrap items-center gap-2 md:gap-5 text-xs md:text-sm text-gray-600'>
                    <div className='border border-gray-400 px-1 rounded-lg flex items-center gap-1'>
                        <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                        <span>{hotelDetails.star} star</span>
                    </div>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-xs"></i>
                        <span>{hotelDetails.location}</span>
                    </p>
                </div>

                {/* Nearby locations section */}
                {nearbyLocations.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Nearby Locations:</h3>
                        <ul className="text-xs text-gray-600 space-y-1 ml-3">
                            {nearbyLocations.map((location, index) => (
                                <li key={index} className="flex items-start gap-1">
                                    <i className="fa-solid fa-location-dot text-xs mt-1 flex-shrink-0"></i>
                                    <span>{location}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Amenities/summary section */}
                {hotelDetails.summary && hotelDetails.summary.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-xl font-bold text-blue-950 mb-1">Amenities:</h3>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                            {hotelDetails.summary.slice(0, 6).map((amenity) => (
                                <span key={amenity.id} className="flex items-center text-xs md:text-xs bg-gray-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                                    <i className={`${amenity.icon_class} mr-1 md:mr-2 text-blue-900 text-xs`}></i>
                                    {amenity.name}
                                </span>
                            ))}
                            {hotelDetails.summary.length > 6 && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                    +{hotelDetails.summary.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

               
            </div>
        </div>
    );
}