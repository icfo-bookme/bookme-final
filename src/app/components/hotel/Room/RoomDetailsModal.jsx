import Image from 'next/image';

const RoomDetailsModal = ({ room, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 md:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gray-300 flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold">Room Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>

                <div className="p-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{room.room_name}</h3>
                            <ul className="space-y-2">
                                <li className="flex text-xs items-start text-gray-600">
                                    <i className="fa-solid fa-bed mt-1 mr-2"></i>
                                    <span>{room.room_type}</span>
                                </li>
                                <li className="flex text-xs items-start text-gray-600">
                                    <i className="fa-solid fa-user mt-1 mr-2"></i>
                                    <span>{room.max_adults} Adults</span>
                                </li>
                            </ul>
                        </div>

                        <hr />
                        <div className='flex justify-between gap-2'>
                            <p> <span className='font-semibold text-xs'>Adult Occupancy: </span> {room.max_adults}</p>
                            <p className='mr-5'> <span className='font-semibold text-xs'>
                                Complementary Child Occupancy: </span> {room.complementary_child_occupancy}</p>
                        </div>
                        <div className='flex justify-between -mt-5 gap-2'>
                            <p> <span className='font-semibold text-xs'>On Demand Extra Bed: </span> {room.on_demand_extra_bed}</p>
                            <p className='mr-5'> <span className='font-semibold text-xs'>
                                Maximum Number of Guests Allowed: </span> {room.max_guests_allowed}</p>
                        </div>
                        <hr />

                        <div className='flex justify-between text-xs gap-2'>
                            <p> <span className='font-semibold text-xs'>Room Type: </span> {room.room_type}</p>
                            <p className="mr-5 text-xs">
                                <span className="font-semibold text-xs">Smoking status: </span>
                                {room.smoking_status == 1 ? "Yes" : "No"}
                            </p>
                        </div>
                        <div className='flex justify-between -mt-5 gap-2'>
                            <p> <span className='font-semibold text-xs'>Room Characteristics: </span> {room.room_characteristics}</p>
                            <p className='mr-5'> <span className='font-semibold text-xs'>
                                Room Size: </span> {room.room_size_sqft} Sqft</p>
                        </div>
                        <hr />
                    </div>

                    {/* Features by Category */}
                    {room.features_by_category?.length > 0 ? (
                        <div className="mb-6">
                            <div className="space-y-6">
                                {room.features_by_category.map((category) => (
                                    <div key={category.category_id}>
                                        <h4 className="font-medium text-blue-900 border-b pb-1 mb-3">{category.category_name}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Array.isArray(category.features) ? (
                                                category.features.map((feature) => (
                                                    <div key={feature.id} className="flex items-start">
                                                        <i className="fa fa-check mt-1 mr-2 text-blue-900 text-sm"></i>
                                                        <span>{feature.name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.values(category.features).map((feature) => (
                                                    <div key={feature.id} className="flex items-start">
                                                        <i className="fa fa-check mt-1 mr-2 text-blue-900 text-sm"></i>
                                                        <span>{feature.name}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                            <p className="text-gray-500">No amenity information available.</p>
                        </div>
                    )}
                </div>

                <div className="border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsModal;