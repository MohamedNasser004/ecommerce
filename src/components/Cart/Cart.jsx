import { useSelector, useDispatch } from "react-redux";
import {
    incrementItem,
    decrementItem,
    removeItem,
} from "../../redux/slices/cartSlice";

const Cart = () => {
    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const dispatch = useDispatch();

    console.log("Cart Page:", cartItems);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4">

                <h1 className="text-3xl font-bold mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center">
                        <p className="text-gray-500 text-lg">
                            Your cart is empty
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5"
                            >

                                {/* Product Image */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-28 h-28 object-contain rounded-xl bg-gray-50"
                                />

                                {/* Product Info */}
                                <div className="flex-1">

                                    <h2 className="text-lg font-bold text-gray-900">
                                        {item.title}
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        ${item.price.toFixed(2)}
                                    </p>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-3 mt-4">

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    decrementItem(item.id)
                                                )
                                            }
                                            className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold min-w-8 text-center">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    incrementItem(item.id)
                                                )
                                            }
                                            className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100"
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                {/* Delete */}
                                <button
                                    onClick={() =>
                                        dispatch(removeItem(item.id))
                                    }
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Delete
                                </button>

                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;