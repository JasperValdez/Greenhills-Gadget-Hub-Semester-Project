import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* Updated Toaster for mobile responsiveness and light theme */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        gutter={8} // Added spacing for mobile notifications
        toastOptions={{
          duration: 3000,
          className: 'text-sm sm:text-base', // Smaller text on phones
          style: {
            background: '#ffffff',
            color: '#1f2937', 
            border: '1px solid #e5e7eb', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            borderRadius: '12px',
            padding: '12px 16px',
            maxWidth: '90vw', // Prevents toast from hitting screen edges on mobile
          },
          success: {
            iconTheme: {
              primary: '#10b981', 
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Main layout wrapper with responsive flex-col */}
      <div className="flex flex-col min-h-screen bg-[#F9FAFB]"> 
        <Navbar />
        
        {/* Added responsive padding-x so content doesn't touch the screen edges on mobile */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* User Protected Routes (Requires Login) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;