import TopHeader from "./components/Header/TopHeader";
import BottomHeader from "./components/Header/BottomHeader";
import Home from "./pages/Home";
import ProductsByCategory from "./pages/ProductsByCategory";
import Api from "./pages/products/Api";
import ProductDescription from "./pages/ProductDescription";
import Cart from "./components/Cart/cart";
import CheckOut from "./pages/CheckOut";
import Footer from "./components/Footer/Footer";
import Category from "./pages/Category";
// Dashboard
import Dashboard from "./Dashboard/Dashboard";
import AddProduct from "./Dashboard/product/AddProduct";
import AdminProducts from "./Dashboard/product/AdminProducts";
import AdminCategories from "./Dashboard/Category/AdminCategories";
import AddCategory from "./Dashboard/Category/AddCategory";
import UpdateProduct from "./Dashboard/product/UpdateProduct";

// Users
import User from "./Dashboard/user/Users";
import AddUser from "./Dashboard/user/AddUser";
import EditUser from "./Dashboard/user/EditUser";

// Offers
import AddOffer from "./Dashboard/offers/AddOffer";
import OffersList from "./Dashboard/offers/OffersList";

// Orders
import AdminOrders from "./Dashboard/orders/Orders";
import OrderDetails from "./Dashboard/orders/OrderDetails";
import UpdateOrder from "./Dashboard/orders/UpdateOrder";

// Articles
import BlogList from "./Dashboard/articles/BlogList";
import AddBlog from "./Dashboard/articles/AddBlog";
import Edit from "./Dashboard/articles/Edit";
import BlogDetails from "./Dashboard/articles/BlogDetails";

// Authentication
import Login from "./pages/login";
import Register from "./pages/Register";

// Contexts
import { SidebarProvider } from "./Dashboard/SidebarContext";
import { ThemeProvider } from "./Dashboard/ThemeContext";

import { Routes, Route, Outlet } from "react-router-dom";

// ========================================
// Frontend Layout
// ========================================

function FrontendLayout() {
  return (
    <>
      <TopHeader />
      <BottomHeader />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

// ========================================
// App
// ========================================

function App() {
  return (
    <Routes>
      {/* ================================== */}
      {/* Frontend Layout */}
      {/* Header + Footer */}
      {/* ================================== */}

      <Route element={<FrontendLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Checkout */}
        <Route path="/checkout" element={<CheckOut />} />

        <Route path="/categories/:id" element={<Category />} />
        {/* Products */}
        <Route path="/products" element={<Api />} />

        {/* Product Details */}
        <Route path="/product/:id" element={<ProductDescription />} />
      </Route>

      {/* ================================== */}
      {/* Dashboard */}
      {/* بدون Header و Footer */}
      {/* ================================== */}

      <Route
        path="/dashboard"
        element={
          <ThemeProvider>
            <SidebarProvider>
              <Dashboard />
            </SidebarProvider>
          </ThemeProvider>
        }
      >
        {/* Dashboard Home */}
        <Route
          index
          element={
            <h2 className="text-gray-800 dark:text-gray-200">
              Welcome to Dashboard
            </h2>
          }
        />

        {/* ================================== */}
        {/* Products */}
        {/* ================================== */}

        <Route path="product" element={<AdminProducts />} />

        <Route path="product/add" element={<AddProduct />} />

        <Route path="product/update/:id" element={<UpdateProduct />} />

        {/* ================================== */}
        {/* Categories */}
        {/* ================================== */}

        <Route path="category" element={<AdminCategories />} />

        <Route path="category/add" element={<AddCategory />} />

        {/* ================================== */}
        {/* Users */}
        {/* ================================== */}

        <Route path="users" element={<User />} />

        <Route path="users/add" element={<AddUser />} />

        <Route path="users/edit/:id" element={<EditUser />} />

        {/* ================================== */}
        {/* Offers */}
        {/* ================================== */}

        <Route path="offers" element={<OffersList />} />

        <Route path="offers/add" element={<AddOffer />} />

        {/* ================================== */}
        {/* Orders */}
        {/* ================================== */}

        <Route path="orders" element={<AdminOrders />} />

        <Route path="orders/:orderId" element={<OrderDetails />} />

        <Route path="orders/edit/:orderId" element={<UpdateOrder />} />

        {/* ================================== */}
        {/* Articles / Blog */}
        {/* ================================== */}

        <Route path="articles" element={<BlogList />} />

        <Route path="articles/new" element={<AddBlog />} />

        <Route path="articles/:slug/edit" element={<Edit />} />

        <Route path="articles/:slug" element={<BlogDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
