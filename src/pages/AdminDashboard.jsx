import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"; // Added toast
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Boxes,
  AlertTriangle,
  LayoutGrid,
  X,
  ClipboardList,
  Truck,
  CheckCircle,
  Bell // Added Bell icon for style
} from "lucide-react";

const CATEGORIES = ["Laptop", "Monitor", "Phone", "Keyboard", "Headphones", "Mouse"];

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Laptop",
    quantity: "",
    description: "",
    image_url: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
        toast.error(error.message);
    } else {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();

    // REAL-TIME NOTIFICATION FOR NEW ORDERS
    const orderSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: 'INSERT', table: 'orders' }, (payload) => {
        toast(`New Order from ${payload.new.customer_name}!`, {
            icon: '🛒',
            style: { borderRadius: '12px', background: '#333', color: '#fff' },
        });
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...productForm,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity)
    };

    try {
      if (editId) {
        const { error } = await supabase.from("products").update(submissionData).eq("id", editId);
        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        const { error } = await supabase.from("products").insert([submissionData]);
        if (error) throw error;
        toast.success("New product added to inventory!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setProductForm({
      name: "",
      price: "",
      category: "Laptop",
      quantity: "",
      description: "",
      image_url: ""
    });
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      description: product.description,
      image_url: product.image_url || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Editing mode enabled", { icon: "📝" });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
        toast.error(error.message);
    } else {
        toast.success("Product removed");
        fetchProducts();
    }
  };

  const lowStockCount = products.filter((p) => p.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders ({orders.filter(o => o.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <Boxes size={32} className="text-green-500" />
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Inventory</p>
            <h2 className="text-2xl font-bold">{products.length} Items</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <AlertTriangle size={32} className="text-red-500" />
          <div>
            <p className="text-gray-500 text-sm font-medium">Critical Stock</p>
            <h2 className="text-2xl font-bold">{lowStockCount} Low Items</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-4">
          <ClipboardList size={32} className="text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <h2 className="text-2xl font-bold">{orders.length} Placed</h2>
          </div>
        </div>
      </div>

      {activeTab === "inventory" ? (
        <>
          {/* Product Form */}
          <motion.div layout className="bg-white p-6 rounded-2xl shadow-sm border mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" />
                {editId ? "Edit Existing Product" : "Register New Product"}
              </h2>
              {editId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <select 
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Price (₱)</label>
                <input 
                  type="number" 
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Stock Quantity</label>
                <input 
                  type="number" 
                  required
                  value={productForm.quantity}
                  onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                <input 
                  type="text" 
                  required
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea 
                  rows={3} 
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="lg:col-span-3 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Inventory" : "Add to Inventory"}
              </button>
            </form>
          </motion.div>

          {/* Product List */}
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutGrid className="text-gray-400" /> Live Catalog
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col group"
                >
                  <div className="h-40 relative">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-black uppercase">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold truncate">{p.name}</h3>
                    <p className="text-blue-600 font-bold">₱{Number(p.price).toLocaleString()}</p>
                    <div className="mt-2 mb-4">
                      {p.quantity <= 5 ? (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">LOW STOCK ({p.quantity})</span>
                      ) : (
                        <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">IN STOCK ({p.quantity})</span>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2 pt-4 border-t">
                      <button onClick={() => handleEdit(p)} className="flex-1 bg-gray-100 hover:bg-blue-100 p-2 rounded-lg transition flex justify-center items-center gap-1">
                        <Pencil size={14} /> <span className="text-xs font-bold">EDIT</span>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex-1 bg-gray-100 hover:bg-red-100 p-2 rounded-lg transition flex justify-center items-center gap-1 text-red-600">
                        <Trash2 size={14} /> <span className="text-xs font-bold">DELETE</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Orders Section */
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <ClipboardList className="text-blue-600" /> Pending Deliveries
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-10 bg-white rounded-2xl border">No orders placed yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded">#{order.id.slice(0,8).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{order.customer_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{order.customer_address}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-[11px] bg-gray-50 border px-2 py-1 rounded-lg font-medium text-gray-600">
                          {item.name} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                    <p className="text-xl font-black text-gray-900">₱{order.total_price.toLocaleString()}</p>
                    <div className="flex gap-2 w-full">
                      {order.status === "pending" && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          className="flex-1 bg-blue-600 text-white p-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1 shadow-md"
                        >
                          <Truck size={14}/> SHIP
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                          className="flex-1 bg-green-600 text-white p-2 rounded-xl text-xs font-bold hover:bg-green-700 transition flex items-center justify-center gap-1 shadow-md"
                        >
                          <CheckCircle size={14}/> DELIVER
                        </button>
                      )}
                      {order.status === "delivered" && (
                         <span className="text-green-600 text-xs font-black py-2 w-full text-center">COMPLETED</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;