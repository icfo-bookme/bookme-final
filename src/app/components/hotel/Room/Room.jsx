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
        <div className="container mx-auto px-4 py-8 text-blue-950">
            <h1 className="text-3xl font-bold mb-8">Rooms for Hotel #{hotel_id}</h1>

            <div className="">
                {rooms.map((room) => (
                    <div key={room.id} className="mb-8 py-4 rounded-lg bg-gray-100 md:grid md:grid-cols-8 gap-6">
                        <div className='md:col-span-3 border-r border-gray-300'>
                            <RoomCarousel images={room.images} key={room.id} />
                            <h2 className="text-xl pl-4 font-semibold mb-2">{room.name}</h2>
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