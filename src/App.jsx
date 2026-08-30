import TopHeader from "./components/Header/TopHeader";
import BottomHeader from "./components/Header/BottomHeader";
import Home from "./pages/Home";
import ProductsByCategory from "./pages/ProductsByCategory";
import ProductDescription from "./pages/ProductDescription";
import Cart from "./components/Cart/cart";
import Footer from "./components/Footer/Footer";

import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            <TopHeader />
            <BottomHeader />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/products" element={<ProductsByCategory />} />
                <Route path="/product/:id" element={<ProductDescription />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;