'use client';
import { useEffect, useState } from 'react';
import getRooms from "@/services/room/getroom";
import Image from 'next/image';
import RoomCarousel from './Slider';

const RoomComponent = ({ hotel_id }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="container mx-auto  text-blue-950">
            <div className="bg-blue-50 p-6 rounded-t-lg shadow-md ">
                <h1 className="text-xl font-bold ">Room Details</h1>
            </div>
            <div className="">
                {rooms.map((room) => (
                    <div key={room.id} className="py-4 rounded-lg bg-gray-100 border border-gray-300 mb-4 md:grid md:grid-cols-8 gap-6">
                        <div className='md:col-span-3 border-r border-gray-300'>
                            <RoomCarousel images={room.images} key={room.id} />
                            <h2 className="text-xl mt-5 pl-4 font-semibold mb-2">{room.name}</h2>
                            <div className='text-sm'>
                                <p className="text-gray-600 pl-4 mb-1"><i className="fa-solid fa-flag"></i> {room.room_type}</p>
                                <p className="text-gray-600 pl-4"><i className="fa-solid fa-users"></i>  Maximum Room Capacity: {room.max_adults} </p>
                                <button className=" text-blue-900 px-4 py-5 rounded font-bold underline transition">View Room Details</button>
                            </div>

                            <div>
                                {room.feature_summary && (
                                    <div className="mt-4 pl-4">
                                      
                                        <div className="flex flex-wrap gap-2">
                                            {room.feature_summary.map((amenity) => (
                                                <span
                                                    key={amenity.id}
                                                    className="flex items-center text-sm bg-gray-200   rounded-full"
                                                >
                                                    <i className={`fa fa-check mr-1 text-blue-900`}></i>
                                                    {amenity.name}
                                                </span>
                                            ))}
                                            {room.feature_summary > 6 && (
                                                <button
                                                    className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                                                    onClick={() => toggleAmenities(room.id)}
                                                >
                                                    {showAllAmenities[room.id] ? 'Show less' : `+${room.summary.length - 6} more`}
                                                </button>
                                            )}
                                        </div> 
                                    </div>
                                )}
                            </div>
                            <button className=" text-blue-900 px-4 py-5 text-xs rounded font-bold underline transition">See All</button>


                        </div>
                        <div className="md:col-span-5">

                            <p className="text-gray-600 mb-4">{room.description}</p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg font-bold text-blue-900">${room.price}</span>
                                <span className="text-sm text-gray-500">per night</span>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                Book Now
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomComponent;