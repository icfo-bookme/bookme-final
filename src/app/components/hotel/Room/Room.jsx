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
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const addToCart = (room) => {
        const discountedPrice = Math.round(room.price - (room.price * room.discount / 100));
        const taxes = Math.round(discountedPrice * 0.265);
        const totalPrice = discountedPrice + taxes;
        
        const cartItem = {
            id: room.id,
            name: room.room_name,
            type: room.room_type,
            adults: room.max_adults,
            children: room.complementary_child_occupancy,
            price: discountedPrice,
            taxes: taxes,
            total: totalPrice,
            breakfast: room.breakfast_status === 'included' ? 'Included' : 'Not Included',
            image: room.images?.[0]?.url || ''
        };

        setCart([...cart, cartItem]);
        if (!isLargeScreen) {
            setShowCart(true);
        }
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        if (newCart.length === 0) {
            setShowCart(false);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.total, 0);
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
        <div className="md:container w-[98%] lg:w-[100%] mx-auto text-blue-950 grid grid-cols-1 md:grid-cols-6 md:gap-4 mb-6 relative">
            {/* Floating Cart Icon (Mobile and LG) */}
            {(cart.length > 0 && (isLargeScreen || window.innerWidth < 768)) && (
                <div className={`fixed ${isLargeScreen ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-40`}>
                    <button 
                        onClick={() => setShowCart(!showCart)}
                        className="relative bg-blue-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <i className="fa-solid fa-cart-shopping text-xl"></i>
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            )}

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
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{selectedRoom.name}</h3>
                                    <ul className="space-y-2">
                                        <li className="flex text-xs items-start text-gray-600">
                                            <i className="fa-solid fa-bed mt-1 mr-2"></i>
                                            <span>{selectedRoom.room_type}</span>
                                        </li>
                                        <li className="flex text-xs items-start text-gray-600">
                                            <i className="fa-solid fa-user mt-1 mr-2"></i>
                                            <span>{selectedRoom.max_adults} Adults</span>
                                        </li>
                                    </ul>
                                </div>

                                <hr />
                                <div className='flex justify-between gap-2'>
                                    <p> <span className='font-semibold text-xs'>Adult Occupancy: </span> {selectedRoom.max_adults}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs'>
                                        Complementary Child Occupancy: </span> {selectedRoom.complementary_child_occupancy}</p>
                                </div>
                                <div className='flex justify-between -mt-5 gap-2'>
                                    <p> <span className='font-semibold text-xs'>On Demand Extra Bed: </span> {selectedRoom.on_demand_extra_bed}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs'>
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
                                    <p> <span className='font-semibold text-xs'>Room Characteristics: </span> {selectedRoom.room_characteristics}</p>
                                    <p className='mr-5'> <span className='font-semibold text-xs'>
                                        Room Size: </span> {selectedRoom.room_size_sqft} Sqft</p>
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
            <div className='md:col-span-6'>
                <div className="bg-blue-50 p-3 rounded-t-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold">Room Details</h1>
                        {(cart.length > 0 && !isLargeScreen) && (
                            <button 
                                onClick={() => setShowCart(!showCart)}
                                className="relative bg-blue-900 text-white px-3 py-1 rounded-md text-sm md:hidden"
                            >
                                <i className="fa-solid fa-cart-shopping mr-2"></i>
                                View Cart ({cart.length})
                            </button>
                        )}
                    </div>
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
                                        <div className="pl-4">
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
                                        onClick={() => addToCart(room)}
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

          

            {/* Floating Cart Panel (Mobile and LG) */}
            {(showCart && cart.length > 0) && (
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex ${isLargeScreen ? 'items-center justify-end' : 'items-end'}`}>
                    <div className={`bg-white ${isLargeScreen ? 'w-96 rounded-l-lg h-[80vh] mr-0' : 'w-full rounded-t-lg max-h-[70vh]'} shadow-lg overflow-y-auto`}>
                        <div className="bg-blue-900 text-white p-3 sticky top-0 flex justify-between items-center">
                            <h3 className="font-bold">Your Cart ({cart.length})</h3>
                            <button 
                                onClick={() => setShowCart(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <i className="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className={`overflow-y-auto ${isLargeScreen ? 'h-[calc(80vh-120px)]' : 'max-h-[60vh]'} p-3`}>
                            {cart.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 py-3 flex items-start">
                                    {item.image && (
                                        <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                                            <Image 
                                                src={item.image} 
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-600">{item.type}</p>
                                        <p className="text-xs text-gray-600">{item.adults} Adults, {item.children} Children</p>
                                        <p className="text-xs text-gray-600">Breakfast: {item.breakfast}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">BDT {item.price}</p>
                                        <button 
                                            onClick={() => removeFromCart(index)}
                                            className="text-red-500 text-xs hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold text-lg">BDT {calculateTotal()}</span>
                            </div>
                            <Button
                                style={{
                                    background: "linear-gradient(90deg, #313881, #0678B4)",
                                }}
                                className="w-full py-2 text-white rounded hover:opacity-90 transition-colors"
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomComponent;