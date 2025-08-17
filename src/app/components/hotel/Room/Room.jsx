'use client';
import { useEffect, useState } from 'react';
import getRooms from "@/services/room/getroom";
import RoomList from './RoomList';
import RoomDetailsModal from './RoomDetailsModal';
import Cart from './Cart';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import NoRoomsAvailable from './NoRoomsAvailable';
import CartButton from './CartButton';

const RoomComponent = ({ hotel_id, checkin, checkout }) => {
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

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    if (!rooms?.length) return <NoRoomsAvailable />;

    return (
        <div className="md:container w-[98%] lg:w-[100%] mx-auto text-blue-950 grid grid-cols-1 md:grid-cols-6 md:gap-4  relative">
            {/* Floating Cart Button */}
            {(cart.length > 0 && (isLargeScreen || window.innerWidth < 768)) && (
                <CartButton
                    cartCount={cart.length}
                    isLargeScreen={isLargeScreen}
                    onClick={() => setShowCart(!showCart)}
                />
            )}

            {/* Room Details Modal */}
            {isModalOpen && selectedRoom && (
                <RoomDetailsModal
                    room={selectedRoom}
                    onClose={closeModal}
                />
            )}

            {/* Main Room Listing */}
            <RoomList
                rooms={rooms}
                cart={cart}
                isLargeScreen={isLargeScreen}
                onShowCart={() => setShowCart(!showCart)}
                onViewDetails={openRoomDetails}
                onAddToCart={addToCart}
            />


            {(showCart && cart.length > 0) && (
                <Cart
                    cart={cart}
                    isLargeScreen={isLargeScreen}
                    onClose={() => setShowCart(false)}
                    onRemoveItem={removeFromCart}
                    checkin={checkin}
                    checkout={checkout}
                />
            )}
        </div>
    );
};

export default RoomComponent;