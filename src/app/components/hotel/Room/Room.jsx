'use client';
import { useEffect, useState } from 'react';
import getRooms from "@/services/room/getroom";
import Image from 'next/image';
import RoomCarousel from './Slider';
import { Button } from 'flowbite-react';

const RoomComponent = ({ hotel_id }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { success, rooms, error } = await getRooms(hotel_id);
                if (!success) throw new Error(error);
                setRooms(rooms);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hotel_id]);

    const openRoomDetails = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRoom(null);
    };

    const getFormattedDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        return today.toLocaleDateString('en-GB', options).replace(',', '');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading rooms: {error}
        </div>
    );

    if (!rooms?.length) return (
        <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No rooms available for this hotel</p>
        </div>
    );

    return (
        <div className="md:container w-[98%] lg:w-[100%] mx-auto text-blue-950 grid grid-cols-1 md:grid-cols-6 md:gap-4 mb-6">
            {/* Room Details Modal */}
            {isModalOpen && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 md:p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gray-300 flex justify-between items-center border-b p-4">
                            <h2 className="text-xl font-bold">Room Details</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fa-solid fa-times text-2xl"></i>
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Room Images */}


                            {/* Basic Info */}
                            <div className="grid grid-cols-1  gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2"> {selectedRoom.name}</h3>
                                    <ul className="space-y-2">
                                        <li className="flex text-xs items-start text-gray-600">
                                            <i className="fa-solid fa-bed mt-1 mr-2 "></i>
                                            <span>{selectedRoom.room_type}</span>
                                        </li>
                                        <li className="flex text-xs items-start text-gray-600">
                                            <i className="fa-solid fa-user mt-1 mr-2 "></i>
                                            <span>{selectedRoom.max_adults} Adults</span>
                                        </li>

                                    </ul>
                                </div>

                                <hr />
                                <div className='flex justify-between gap-2'>
                                    <p> <span className='font-semibold text-xs'>Adult Occupancy: </span> {selectedRoom.max_adults}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs '>
                                        Complementary Child Occupancy: </span> {selectedRoom.complementary_child_occupancy}</p>
                                </div>
                                <div className='flex justify-between -mt-5 gap-2'>
                                    <p> <span className='font-semibold text-xs'>On Demand Extra Bed: </span> {selectedRoom.on_demand_extra_bed}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs '>
                                        Maximum Number of Guests Allowed: </span> {selectedRoom.max_guests_allowed}</p>
                                </div>
                                <hr />

                                <div className='flex justify-between text-xs gap-2'>
                                    <p> <span className='font-semibold text-xs'>Room Type: </span> {selectedRoom.room_type}</p>
                                    <p className="mr-5 text-xs">
                                        <span className="font-semibold text-xs">Smoking status: </span>
                                        {selectedRoom.smoking_status == 1 ? "Yes" : "No"}
                                    </p>

                                </div>
                                <div className='flex justify-between -mt-5 gap-2'>
                                    <p> <span className='font-semibold text-xs'>Room Characteristics : </span> {selectedRoom.room_characteristics}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs '>
                                        Room Size : </span> {selectedRoom.room_size_sqft} Sqft</p>
                                </div>
                                <hr />

                            </div>

                            {/* Features by Category */}
                            {selectedRoom.features_by_category?.length > 0 ? (
                                <div className="mb-6">

                                    <div className="space-y-6">
                                        {selectedRoom.features_by_category.map((category) => (
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
                                onClick={closeModal}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Room Listing */}
            <div className='md:col-span-5'>
                <div className="bg-blue-50 p-3 rounded-t-lg shadow-md">
                    <h1 className="text-lg font-bold">Room Details</h1>
                </div>
                <div className="">
                    {rooms.map((room, index) => (
                        <div key={room.id} className="py-4 rounded-lg bg-gray-100 border border-gray-300 mb-4 md:grid md:grid-cols-8 justify-between gap-6">
                            <div className='md:col-span-3 border-r border-gray-300'>
                                <RoomCarousel images={room.images} key={room.id} />
                                <h2 className="text-xl mt-5 pl-4 font-semibold mb-2">{room.room_name}</h2>
                                <div className='text-sm'>
                                    <p className="text-gray-600 pl-4 mb-1"><i className="fa-solid fa-flag"></i> {room.room_type}</p>
                                    <p className="text-gray-600 pl-4"><i className="fa-solid fa-users"></i> Maximum Room Capacity: {room.max_adults} </p>
                                    <button
                                        className="text-blue-900 px-4 py-5 rounded font-bold underline transition"
                                        onClick={() => openRoomDetails(room)}
                                    >
                                        View Room Details
                                    </button>
                                </div>

                                <div>
                                    {room.feature_summary?.length > 0 && (
                                        <div className=" pl-4">
                                            <div className="flex flex-wrap gap-2">
                                                {room.feature_summary.slice(0, 6).map((amenity) => (
                                                    <span
                                                        key={amenity.id}
                                                        className="flex items-center text-sm bg-gray-200 px-2 py-1 rounded-full"
                                                    >
                                                        <i className={`fa fa-check mr-1 text-blue-900`}></i>
                                                        {amenity.name}
                                                    </span>
                                                ))}
                                                {room.feature_summary.length > 6 && (
                                                    <button
                                                        className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                                                        onClick={() => openRoomDetails(room)}
                                                    >
                                                        +{room.feature_summary.length - 6} more
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {room.features_by_category?.length > 0 && (
                                    <button
                                        className="text-blue-900 px-4 text-xs rounded font-bold underline transition"
                                        onClick={() => openRoomDetails(room)}
                                    >
                                        See All
                                    </button>
                                )}
                            </div>
                            <div className="md:col-span-5">
                                <div className='grid grid-cols-2 gap-4 p-4'>
                                    <div className=''>
                                        <p className='bg-gray-300 text-xs text-gray-800 w-16 rounded-md p-1 font-semibold'>Option {index + 1}</p>
                                        <p className='font-bold mt-2 text-lg'>Refundable <i className="fa fa-info-circle" aria-hidden="true"></i></p>
                                        <p className="text-gray-600 mt-2 text-sm flex items-center gap-2">
                                            <i className="fa-solid fa-user-group"></i>
                                            {room.max_adults} Adults , {room.complementary_child_occupancy} Children
                                        </p>
                                        <p className="text-gray-600 mt-2 text-sm flex items-center gap-2">
                                            <i className="fa-solid fa-utensils"></i>
                                            Breakfast {room.breakfast_status === 'included' ? 'Included' : 'Not Included'}
                                        </p>

                                        <p className="text-gray-600 mt-2 text-xs mb-4">{room.room_characteristics}</p>
                                        <li className='text-xs'>Free cancellation before 00:01 on {getFormattedDate()}</li>
                                    </div>
                                    <div className='text-end'>
                                        {room.discount > 0 && (
                                            <span className="text-sm bg-[#FD7E14] text-white font-bold px-2 py-0.5 rounded-xl">
                                                {room.discount}% OFF
                                            </span>
                                        )}
                                        <p className='mt-3 text-green-500 text-xs'>{room.extra_discount_msg}</p>
                                        <p className='mt-3 text-xs'>Starts From</p>
                                        {room.discount > 0 && (
                                            <p className="text-xs md:text-sm text-red-500 line-through">BDT {room.price}</p>
                                        )}
                                        <p className="text-lg md:text-xl font-bold text-blue-900">
                                            BDT {Math.round(room.price - (room.price * room.discount / 100))}
                                        </p>
                                        <p className='mt-1 text-xs text-gray-700'>
                                            + BDT {Math.round((room.price - (room.price * room.discount / 100)) * 0.265)} Taxes & Fees
                                        </p>

                                        <p className='text-xs text-gray-700 mt-3'>for 1 Night , per room</p>


                                    </div>

                                </div>
                                <div className="flex text center justify-end items-end md:pt-0 mr-3">
                                    <Button
                                        style={{
                                            background: "linear-gradient(90deg, #313881, #0678B4)",
                                        }}
                                        className="w-full text-center md:w-auto mt-2 px-2 py-1 md:px-3 md:py-2 text-white rounded hover:opacity-90 transition-colors text-sm"
                                    >
                                        Add Room
                                    </Button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='md:col-span-1 hidden md:block'>
                {/* Empty space for layout balance */}
            </div>
        </div>
    );
};

export default RoomComponent;