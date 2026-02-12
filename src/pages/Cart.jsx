import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select(`
          id, quantity, product_id,
          products ( id, name, price, image_url, quantity, description )
        `)
        .eq("user_id", userData.user.id);

      if (!error && data) {
        setCartItems(data.map(c => ({
          id: c.id,
          quantity: c.quantity,
          name: c.products?.name,
          price: c.products?.price,
          image_url: c.products?.image_url,
          stock: c.products?.quantity,
        })));
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQty) => {
    const item = cartItems.find(i => i.id === cartId);
    if (!item || newQty < 1 || newQty > item.stock) return;

    setUpdatingId(cartId);
    const { error } = await supabase.from("cart").update({ quantity: newQty }).eq("id", cartId);
    if (!error) {
      setCartItems(prev => prev.map(i => i.id === cartId ? { ...i, quantity: newQty } : i));
    }
    setUpdatingId(null);
  };

  const removeItem = async (cartId) => {
    setRemovingId(cartId);
    const { error } = await supabase.from("cart").delete().eq("id", cartId);
    if (!error) setCartItems(prev => prev.filter(i => i.id !== cartId));
    setRemovingId(null);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="bg-emerald-50 p-6 rounded-full mb-4">
        <ShoppingBag size={48} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
      <Link to="/" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
        Go Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag size={32} className="text-emerald-600" /> My Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-emerald-100 transition-colors"
              >
                <img src={item.image_url} alt={item.name} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl bg-gray-50" />
                
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800 md:text-lg">{item.name}</h3>
                  <p className="text-emerald-600 font-bold mb-2">₱{parseFloat(item.price).toLocaleString()}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item.id}
                        className="p-1 hover:bg-white text-gray-600 hover:text-emerald-600 rounded-md transition disabled:opacity-30"
                      ><Minus size={16} /></button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || updatingId === item.id}
                        className="p-1 hover:bg-white text-gray-600 hover:text-emerald-600 rounded-md transition disabled:opacity-30"
                      ><Plus size={16} /></button>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Stock: {item.stock}</span>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
            
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-900">₱{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-bold" : "font-medium text-gray-900"}>
                  {shipping === 0 ? "FREE" : `₱${shipping}`}
                </span>
              </div>
              {subtotal < 5000 && (
                <p className="text-[11px] text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-2">
                  <Truck size={14} /> Add ₱{(5000 - subtotal).toLocaleString()} more for FREE shipping!
                </p>
              )}
            </div>

            <div className="border-t border-dashed pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-black text-gray-900">
                <span>Total</span>
                <span className="text-emerald-600">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                cartItems.some(i => i.stock === 0) 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 hover:shadow-emerald-200"
              }`}
            >
              {cartItems.some(i => i.stock === 0) ? "Remove Out of Stock" : "Checkout Now"}
              <ArrowRight size={18} />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <span>Secure Payment</span>
              <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;