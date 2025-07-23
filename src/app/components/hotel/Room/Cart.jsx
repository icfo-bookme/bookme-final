import Image from 'next/image';
import { Button } from 'flowbite-react';

const Cart = ({ cart, isLargeScreen, onClose, onRemoveItem }) => {
    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.total, 0);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex ${isLargeScreen ? 'items-center justify-end' : 'items-end'}`}>
            <div className={`bg-white ${isLargeScreen ? 'w-96 rounded-l-lg h-[80vh] mr-0' : 'w-full rounded-t-lg max-h-[70vh]'} shadow-lg overflow-y-auto`}>
                <div className="bg-blue-900 text-white p-3 sticky top-0 flex justify-between items-center">
                    <h3 className="font-bold">Your Cart ({cart.length})</h3>
                    <button 
                        onClick={onClose}
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
                                    onClick={() => onRemoveItem(index)}
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
    );
};

export default Cart;