import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package size={40} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h2>
      <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping to see them here!</p>
      <button onClick={() => navigate("/")} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">
        Browse Products
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-green-600" size={32} /> My Purchase History
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-sm font-mono font-bold text-gray-700">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
                  <p className="text-sm font-bold text-gray-700">
                    {new Date(order.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                  {order.status}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-lg font-black text-green-600">₱{order.total_price.toLocaleString()}</p>
                </div>
              </div>

              {/* Order Items (from JSONB) */}
              <div className="p-6 bg-gray-50/50">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₱{parseFloat(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Footer */}
              <div className="px-6 py-4 bg-white border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Truck size={14} />
                  <span className="truncate max-w-[250px] md:max-w-md">Shipping to: <strong>{order.customer_address}</strong></span>
                </div>
                <button 
                  onClick={() => navigate(`/products`)}
                  className="text-green-600 text-xs font-bold flex items-center gap-1 hover:underline"
                >
                  Buy Again <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;