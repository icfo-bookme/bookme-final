const CartButton = ({ cartCount, isLargeScreen, onClick }) => (
    <div className={`fixed ${isLargeScreen ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-40`}>
        <button 
            onClick={onClick}
            className="relative bg-blue-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </button>
    </div>
);

export default CartButton;