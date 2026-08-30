import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaLinkedinIn,
} from "react-icons/fa";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiArrowRight,
} from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white">

            {/* =========================
                Newsletter
            ========================= */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-8
                    ">

                        <div className="max-w-xl">

                            <span className="
                                inline-block
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.2em]
                                text-gray-400
                                mb-3
                            ">
                                Stay Updated
                            </span>

                            <h2 className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                leading-tight
                            ">
                                Subscribe to our newsletter
                            </h2>

                            <p className="
                                mt-3
                                text-gray-400
                                text-sm
                                leading-6
                            ">
                                Get the latest products, exclusive offers,
                                and special discounts directly in your inbox.
                            </p>

                        </div>


                        {/* Newsletter Form */}
                        <form className="w-full lg:max-w-md">

                            <div className="
                                flex
                                items-center
                                bg-white
                                rounded-xl
                                p-1.5
                                focus-within:ring-4
                                focus-within:ring-white/10
                            ">

                                <FiMail className="
                                    ml-3
                                    text-gray-400
                                    flex-shrink-0
                                " />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="
                                        flex-1
                                        min-w-0
                                        px-3
                                        py-3
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        bg-transparent
                                    "
                                />

                                <button
                                    type="submit"
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        bg-gray-900
                                        hover:bg-gray-700
                                        text-white
                                        px-5
                                        py-3
                                        rounded-lg
                                        text-sm
                                        font-semibold
                                        transition
                                    "
                                >
                                    Subscribe
                                    <FiArrowRight />
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            </div>


            {/* =========================
                Main Footer
            ========================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-10
                    lg:gap-16
                ">

                    {/* =========================
                        Brand
                    ========================= */}
                    <div>

                        <Link to="/" className="inline-block">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="
                                    w-36
                                    h-auto
                                    object-contain
                                    brightness-0
                                    invert
                                "
                            />
                        </Link>

                        <p className="
                            text-gray-400
                            text-sm
                            leading-7
                            mt-5
                            max-w-sm
                        ">
                            Discover quality products at great prices.
                            We make shopping simple, convenient,
                            and enjoyable.
                        </p>


                        {/* Social */}
                        <div className="flex items-center gap-3 mt-6">

                            <a
                                href="#"
                                aria-label="Facebook"
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-gray-900
                                    border
                                    border-gray-800
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-white
                                    hover:text-gray-900
                                    hover:border-white
                                    transition
                                "
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-gray-900
                                    border
                                    border-gray-800
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-white
                                    hover:text-gray-900
                                    hover:border-white
                                    transition
                                "
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="#"
                                aria-label="Twitter"
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-gray-900
                                    border
                                    border-gray-800
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-white
                                    hover:text-gray-900
                                    hover:border-white
                                    transition
                                "
                            >
                                <FaTwitter />
                            </a>

                            <a
                                href="#"
                                aria-label="YouTube"
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-gray-900
                                    border
                                    border-gray-800
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-white
                                    hover:text-gray-900
                                    hover:border-white
                                    transition
                                "
                            >
                                <FaYoutube />
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-gray-900
                                    border
                                    border-gray-800
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:bg-white
                                    hover:text-gray-900
                                    hover:border-white
                                    transition
                                "
                            >
                                <FaLinkedinIn />
                            </a>

                        </div>

                    </div>


                    {/* =========================
                        Quick Links
                    ========================= */}
                    <div>

                        <h3 className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            mb-6
                        ">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">

                            <li>
                                <Link
                                    to="/"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    All Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/about"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Shopping Cart
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* =========================
                        Customer Service
                    ========================= */}
                    <div>

                        <h3 className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            mb-6
                        ">
                            Customer Service
                        </h3>

                        <ul className="space-y-4">

                            <li>
                                <Link
                                    to="/shipping"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Shipping & Delivery
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/returns"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Returns & Refunds
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/privacy"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terms"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/faq"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    FAQ
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* =========================
                        Contact
                    ========================= */}
                    <div>

                        <h3 className="
                            text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            mb-6
                        ">
                            Contact Us
                        </h3>

                        <div className="space-y-5">

                            {/* Address */}
                            <div className="flex items-start gap-3">

                                <FiMapPin className="
                                    text-gray-400
                                    text-xl
                                    flex-shrink-0
                                    mt-0.5
                                " />

                                <p className="
                                    text-gray-400
                                    text-sm
                                    leading-6
                                ">
                                    123 Main Street,
                                    <br />
                                    Cairo, Egypt
                                </p>

                            </div>


                            {/* Phone */}
                            <div className="flex items-center gap-3">

                                <FiPhone className="
                                    text-gray-400
                                    text-xl
                                    flex-shrink-0
                                " />

                                <a
                                    href="tel:+201000000000"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    +20 100 000 0000
                                </a>

                            </div>


                            {/* Email */}
                            <div className="flex items-center gap-3">

                                <FiMail className="
                                    text-gray-400
                                    text-xl
                                    flex-shrink-0
                                " />

                                <a
                                    href="mailto:info@example.com"
                                    className="
                                        text-gray-400
                                        text-sm
                                        hover:text-white
                                        transition
                                    "
                                >
                                    info@example.com
                                </a>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                Bottom Bar
            ========================= */}
            <div className="border-t border-gray-800">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                    py-6
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                ">

                    <p className="text-gray-500 text-sm text-center sm:text-left">
                        © {new Date().getFullYear()} Your Store.
                        All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">

                        <span className="
                            text-gray-500
                            text-xs
                        ">
                            Secure Shopping
                        </span>

                        <span className="text-gray-700">
                            •
                        </span>

                        <span className="
                            text-gray-500
                            text-xs
                        ">
                            Fast Delivery
                        </span>

                        <span className="text-gray-700">
                            •
                        </span>

                        <span className="
                            text-gray-500
                            text-xs
                        ">
                            Easy Returns
                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;