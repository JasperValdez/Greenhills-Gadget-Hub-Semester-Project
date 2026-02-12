import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // Added toast import
import { CreditCard, MapPin, User, Mail, ShieldCheck, ArrowLeft } from "lucide-react";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select(`id, quantity, products ( id, name, price, image_url )`)
        .eq("user_id", userData.user.id);

      if (!error && data) {
        setCartItems(data.map(c => ({
          cart_id: c.id,
          id: c.products.id,
          name: c.products.name,
          price: c.products.price,
          quantity: c.quantity,
          image_url: c.products.image_url
        })));
        setFormData(prev => ({ ...prev, email: userData.user.email }));
      }
      setLoading(false);
    };
    fetchCart();
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const orderData = {
        user_id: userData.user.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_address: formData.address,
        items: cartItems, 
        total_price: total,
        status: "pending",
      };

      const { error: orderError } = await supabase.from("orders").insert([orderData]);
      if (orderError) throw orderError;

      // Clear Cart
      await supabase.from("cart").delete().eq("user_id", userData.user.id);

      // Use toast instead of alert
      toast.success("Order placed successfully! ", {
        duration: 4000,
        position: 'top-center',
      });
      
      navigate("/");
    } catch (err) {
      // Use toast for errors
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex justify-center items-center font-bold text-blue-600">Validating Session...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Shipping Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button onClick={() => navigate("/cart")} className="flex items-center text-gray-500 hover:text-black mb-6 transition">
            <ArrowLeft size={18} className="mr-2" /> Return to Cart
          </button>
          
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Secure Checkout
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
              
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="text" placeholder="Full Name" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="email" placeholder="Email Address" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <textarea
                  placeholder="Complete Delivery Address" required rows="3"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2"><CreditCard size={20}/> Payment Method</h3>
                <span className="text-xs bg-blue-700 px-2 py-1 rounded">Cash on Delivery</span>
              </div>
              <p className="text-blue-200 text-sm">Currently only supporting COD in Metro Manila. Pay when your gadgets arrive!</p>
            </div>

            <button
              type="submit" disabled={submitting}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
            >
              {submitting ? "Processing..." : `Pay ₱${total.toLocaleString()}`}
            </button>
          </form>
        </motion.div>

        {/* Right Side: Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:pt-14">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-6">Review Order</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image_url} className="w-16 h-16 rounded-xl object-cover bg-gray-50" alt={item.name} />
                  <div className="flex-grow">
                    <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">₱{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-6 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600">{shipping === 0 ? "FREE" : `₱${shipping}`}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-900 pt-2">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;