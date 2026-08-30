import { Link } from "react-router-dom";
import { TiShoppingCart, TiUser } from "react-icons/ti";
import { useSelector } from "react-redux";

const TopHeader = () => {
    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="h-20 flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex-shrink-0"
                    >
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-32 sm:w-36 h-auto object-contain"
                        />
                    </Link>


                    {/* Search */}
                    <form
                        action=""
                        className="hidden md:flex flex-1 max-w-xl"
                    >
                        <div className="relative w-full">

                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="
                                    w-full
                                    h-11
                                    pl-5
                                    pr-12
                                    rounded-full
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    text-gray-800
                                    placeholder-gray-400
                                    outline-none
                                    transition-all
                                    duration-200
                                    focus:bg-white
                                    focus:border-gray-400
                                    focus:ring-4
                                    focus:ring-gray-100
                                "
                            />

                            <button
                                type="submit"
                                className="
                                    absolute
                                    right-1.5
                                    top-1/2
                                    -translate-y-1/2
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-gray-900
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-700
                                    transition
                                "
                            >
                                🔍
                            </button>

                        </div>
                    </form>


                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="
                                relative
                                w-11
                                h-11
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-gray-700
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                            "
                        >
                            <TiShoppingCart className="text-3xl" />

                            {cartCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -top-1
                                        -right-1
                                        min-w-5
                                        h-5
                                        px-1
                                        rounded-full
                                        bg-red-500
                                        text-white
                                        text-xs
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                        border-2
                                        border-white
                                    "
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>


                        {/* Account */}
                        <Link
                            to="/account"
                            className="
                                w-11
                                h-11
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-gray-700
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                            "
                        >
                            <TiUser className="text-3xl" />
                        </Link>

                    </div>

                </div>


                {/* Mobile Search */}
                <div className="md:hidden pb-4">

                    <form action="">
                        <div className="relative">

                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="
                                    w-full
                                    h-11
                                    pl-5
                                    pr-12
                                    rounded-full
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    outline-none
                                    focus:bg-white
                                    focus:border-gray-400
                                    focus:ring-4
                                    focus:ring-gray-100
                                "
                            />

                            <button
                                type="submit"
                                className="
                                    absolute
                                    right-1.5
                                    top-1/2
                                    -translate-y-1/2
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-gray-900
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                🔍
                            </button>

                        </div>
                    </form>

                </div>

            </div>

        </header>
    );
};

export default TopHeader;