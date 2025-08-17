import RoomItem from './RoomItem';

const RoomList = ({ rooms, cart, isLargeScreen, onShowCart, onViewDetails, onAddToCart }) => {
    return (
        <div className='md:col-span-6 '>
           
            <div className="">
                {rooms.map((room, index) => (
                    <RoomItem 
                        key={room.id} 
                        room={room} 
                        index={index} 
                        onViewDetails={onViewDetails} 
                        onAddToCart={onAddToCart} 
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomList;