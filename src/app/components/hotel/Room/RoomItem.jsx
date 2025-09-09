import { useState } from 'react';
import PrimaryButton from '@/utils/PrimaryButton';
import RoomCarousel from './Slider';
import { Button, Modal } from 'flowbite-react';

const RoomItem = ({ room, index, onViewDetails, onAddToCart }) => {
    const [openModal, setOpenModal] = useState(false);

    const getFormattedDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        return today.toLocaleDateString('en-GB', options).replace(',', '');
    };

    const discountedPrice = Math.round(room.price - (room.price * room.discount / 100));
    const taxesAndFees = Math.round(discountedPrice * 0.265);

    return (
        <div className="py-3">
            <span style={{
                background: "linear-gradient(90deg, #313881, #0678B4)",
            }} className=' text-gray-50 rounded-md p-2 mb-2 font-semibold'>
                Option {index + 1}
            </span>
            <div className="rounded-lg mt-1 bg-gray-100 border border-gray-300 mb-4">

                {/* Mobile View (sm) */}
                <div className="md:hidden">
                    <div className="border-b border-gray-300">
                        <RoomCarousel images={room.images} key={room.id} />
                    </div>
                    <div className="p-4">
                        <p className='bg-gray-300 text-xs text-gray-800 w-16 rounded-md p-1 font-semibold'>Option {index + 1}</p>
                        <h2 className="text-xl text-blue-900 font-semibold mb-2">{room.room_name}</h2>
                        <div className="text-sm">
                            <p className="text-gray-600 mb-1">
                                <i className="fa-solid fa-bed mt-1 mr-2"></i> {room.room_type}
                            </p>
                            <p className="text-gray-600">
                                <i className="fa-solid fa-user mt-1 mr-2"></i> Maximum Room Capacity: {room.max_adults} Adult {room.complementary_child_occupancy} Child
                            </p>
                            <button
                                className="text-blue-900 py-2 rounded font-bold underline transition"
                                onClick={() => onViewDetails(room)}
                            >
                                <i className="fas fa-eye"></i> View Room Details
                            </button>
                        </div>

                        {room.feature_summary?.length > 0 && (
                            <div className="mt-2">
                                <div className="flex flex-wrap gap-2">
                                    {room.feature_summary.slice(0, 6).map((amenity) => (
                                        <span
                                            key={amenity.id}
                                            className="flex items-center text-sm bg-gray-200 px-2 py-1 rounded-full"
                                        >
                                            <i className={`${amenity.icon_class} mr-1 text-blue-600`}></i>
                                            {amenity.name}
                                        </span>
                                    ))}
                                    {room.feature_summary.length > 6 && (
                                        <button
                                            className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                                            onClick={() => onViewDetails(room)}
                                        >
                                            +{room.feature_summary.length - 6} more
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <button
                                    onClick={() => setOpenModal(true)}
                                >
                                    <i className="fa fa-eye text-blue-500" aria-hidden="true"></i> <span className="font-bold underline">Refund Policy</span>
                                </button>

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
                                    BDT {discountedPrice}
                                </p>
                                <p className='mt-1 text-xs text-gray-700'>
                                    + BDT {taxesAndFees} Taxes & Fees
                                </p>
                                <p className='text-xs text-gray-700 mt-3'>for 1 Night , per room</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button
                                onClick={() => onAddToCart(room)}
                                style={{
                                    background: "linear-gradient(90deg, #313881, #0678B4)",
                                }}
                                className="w-full text-center px-3 py-2 text-white rounded hover:opacity-90 transition-colors text-sm"
                            >
                                Add Room
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop View (lg) */}
                <div className="hidden md:grid md:grid-cols-8 gap-6">
                    {/* Left side - Carousel */}
                    <div className='col-span-3 border-r border-gray-300'>
                        <RoomCarousel images={room.images} key={room.id} />
                    </div>

                    {/* Right side - All other information */}
                    <div className="col-span-5 px-4 py-2">
                        {/* Room header section */}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mt-1 mb-1">{room.room_name}</h2>
                                <p className="text-gray-600 text-sm">
                                    <i className="fa-solid fa-bed mt-1 mr-2"></i>{room.room_type}
                                </p>
                                <p className="text-gray-600">
                                    <i className="fa-solid fa-user mt-1 mr-2"></i> Maximum Room Capacity: {room.max_adults} Adult {room.complementary_child_occupancy} Child
                                </p>
                            </div>
                            <div className="text-right">
                                {room.discount > 0 && (
                                    <span className="text-xs bg-[#FD7E14] text-white font-bold px-2 py-1 rounded-full">
                                        {room.discount}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Room details grid */}
                        <div className='grid grid-cols-2 gap-6 mb-4'>
                            <div>
                                <div className="flex items-center gap-3 mb-3 font-bold text-blue-600 hover:text-blue-950">
                                    <button
                                        onClick={() => setOpenModal(true)}
                                    >
                                        <i className="fa fa-eye text-blue-500" aria-hidden="true"></i> <span className="font-bold underline">Refund Policy</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <i className="fa-solid fa-utensils text-gray-500"></i>
                                        Breakfast {room.breakfast_status === 'included' ? 'Included' : 'Not Included'}
                                    </p>
                                    {room.room_characteristics && (
                                        <p className="text-gray-500 text-xs">{room.room_characteristics}</p>
                                    )}
                                    <p className="text-green-600 text-xs flex items-center gap-1">
                                        <i className="fa-regular fa-clock"></i>
                                        Free cancellation before 00:01 on {getFormattedDate()}
                                    </p>
                                </div>
                            </div>

                            {/* Pricing section */}
                            <div className='p-4 rounded-lg'>
                                <div className="flex flex-col h-full justify-between">
                                    <div className="text-right">
                                        <p className='text-gray-500 text-xs'>Starts From</p>
                                        {room.discount > 0 && (
                                            <p className="text-sm text-gray-400 line-through">BDT {room.price.toLocaleString()}</p>
                                        )}
                                        <p className="text-xl font-bold text-blue-800">
                                            BDT {discountedPrice.toLocaleString()}
                                        </p>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            + BDT {taxesAndFees.toLocaleString()} Taxes & Fees
                                        </p>
                                        <p className='text-xs text-gray-500 mt-2'>for 1 Night, per room</p>
                                        {room.extra_discount_msg && (
                                            <p className='text-green-600 text-xs mt-1'>{room.extra_discount_msg}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities section */}
                        {room.feature_summary?.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {room.feature_summary.slice(0, 6).map((amenity) => (
                                        <span
                                            key={amenity.id}
                                            className="flex items-center border border-gray-300 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                                        >
                                            {amenity.icon_class ? (
                                                <i className={`${amenity.icon_class} mr-1 text-blue-600`}></i>
                                            ) : (
                                                <i className="fa fa-check mr-1 text-blue-600"></i>
                                            )}
                                            {amenity.name}
                                        </span>
                                    ))}
                                    {room.feature_summary.length > 6 && (
                                        <button
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            onClick={() => onViewDetails(room)}
                                        >
                                            +{room.feature_summary.length - 6} more
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                            <button
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                                onClick={() => onViewDetails(room)}
                            >
                                <i className="fas fa-eye"></i> <span className='underline'>View Room Details</span>
                            </button>

                            <PrimaryButton onClick={() => onAddToCart(room)}>Add Room</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Policy Modal */}
            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                dismissible
                className=" [&>div]:text-gray-800 bg-slate-200  mt-20"
            >
                <Modal.Header className="border-b border-gray-200">
                    <span className="text-xl font-semibold">Refund Policy</span>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            This room is fully refundable if cancelled before 00:01 on {getFormattedDate()}.
                        </p>
                        <p className="text-gray-700">
                            After this date, the following cancellation policy applies:
                        </p>
                        <ul className="list-disc pl-5 text-gray-700 space-y-2">
                            <li>Cancellations made within 48 hours of check-in will incur a fee equal to one nights stay</li>
                            <li>No-shows will be charged the full amount of the reservation</li>
                            <li>Early departures are subject to the full reservation amount</li>
                        </ul>
                        <p className="text-gray-700">
                            For any changes or cancellations, please contact our customer service team.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-t border-gray-200 flex justify-end">
                    <Button
                        onClick={() => setOpenModal(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        I Understand
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RoomItem;